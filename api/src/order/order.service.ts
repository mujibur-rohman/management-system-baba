import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import {
  AddClosingDto,
  ConfirmOrderDto,
  CreateOrderDto,
  EditOrderDto,
  EditPaymentOrderDto,
  PaymentOrderDto,
} from './dto/order.dto';
import { ProductService } from 'src/product/product.service';
import { Cart, User } from '@prisma/client';
import { FEE, PRICE_MEMBER } from 'src/config/file-config';
import renderRole from 'src/utils/render-role';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomAlphanumeric = require('randomstring');

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
  ) {}

  async createOrder(userData: User, createOrderDto: CreateOrderDto) {
    const noOrder = randomAlphanumeric.generate({
      capitalization: 'uppercase',
      charset: 'alphanumeric',
      length: 10,
    });

    const carts = await this.productService.getCart(userData);

    if (!carts.data.length) {
      throw new BadRequestException('Tidak ada pesanan');
    }

    const date = ('0' + new Date().getDate()).slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const newOrder = await this.prisma.order.create({
      data: {
        noOrder,
        amountCash: createOrderDto.amountCash,
        amountTrf: createOrderDto.amountTrf,
        remainingAmount: createOrderDto.remainingAmount,
        totalPrice: createOrderDto.totalPrice,
        userId: userData.id,
        sellerId: userData.parentId || null,
        isConfirm: false,
        cartData: JSON.stringify(createOrderDto.carts, null, 2),
        orderDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
      },
    });

    // * delete cart
    await this.prisma.cart.deleteMany({
      where: {
        userId: userData.id,
      },
    });

    return {
      data: newOrder,
      message: 'Order sudah masuk!',
    };
  }

  async updateOrder(idOrder: number, editOrder: EditOrderDto) {
    const availableOrder = await this.prisma.order.findFirst({
      where: {
        id: idOrder,
      },
    });

    if (!availableOrder) {
      throw new NotFoundException('Orderan tidak ditemukan');
    }

    await this.prisma.order.update({
      where: {
        id: availableOrder.id,
      },
      data: {
        totalPrice: editOrder.totalPrice,
        remainingAmount: editOrder.remainingAmount,
        cartData: JSON.stringify(editOrder.cart, null, 2),
      },
    });

    return {
      message: 'Pesanan berhasil di ubah!',
    };
  }

  async amountOrder(idPayment: number) {
    const availablePayment = await this.prisma.payment.findFirst({
      where: {
        id: idPayment,
      },
    });

    if (!availablePayment) {
      throw new NotFoundException('Payment tidak ditemukan');
    }

    const availableOrder = await this.prisma.order.findFirst({
      where: {
        id: availablePayment.orderId,
      },
      include: {
        user: true,
      },
    });

    if (!availableOrder) {
      throw new NotFoundException('Orderan tidak ditemukan');
    }

    if (availablePayment.isConfirm) {
      throw new BadRequestException('Pembayaran sudah dikonfirmasi');
    }

    const updatedOrder = await this.prisma.order.update({
      where: {
        id: availableOrder.id,
      },
      data: {
        remainingAmount: (
          parseInt(availableOrder.remainingAmount) -
          parseInt(
            availablePayment.amountCash ? availablePayment.amountCash : '0',
          ) -
          parseInt(
            availablePayment.amountTrf ? availablePayment.amountTrf : '0',
          )
        ).toString(),
        amountCash: (
          parseInt(availableOrder.amountCash) +
          parseInt(availablePayment.amountCash)
        ).toString(),
        amountTrf: (
          parseInt(availableOrder.amountTrf) +
          parseInt(availablePayment.amountTrf)
        ).toString(),
        cartData: availableOrder.cartData,
      },
    });

    await this.prisma.payment.update({
      where: {
        id: availablePayment.id,
      },
      data: {
        isConfirm: true,
      },
    });

    //* process promoted reseller if 200 order
    const userBuyer = await this.prisma.user.findFirst({
      where: {
        id: availableOrder.userId,
      },
    });

    const cartData: Cart[] = JSON.parse(availableOrder.cartData);

    const countQty = cartData.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.qty * 1;
    }, 0);

    const countMember = await this.prisma.user.count({
      where: {
        AND: [
          {
            leaderSignedId: userBuyer.id,
          },
          {
            NOT: {
              role: 'reseller-nc',
            },
          },
        ],
      },
    });

    //* reseller to distributor/ress-up

    if (
      !['supplier', 'distributor', 'reseller-nc'].includes(userBuyer.role) &&
      countQty >= 200 &&
      parseInt(updatedOrder.remainingAmount) === 0 &&
      new Date(availableOrder.orderDate).toLocaleDateString() ===
        new Date().toLocaleDateString()
    ) {
      const userSeller = await this.prisma.user.findFirst({
        where: {
          id: availableOrder.sellerId,
        },
      });

      const date = ('0' + new Date().getDate()).slice(-2);
      const currentMonth = new Date().getMonth() + 1;
      const mo = ('0' + currentMonth).slice(-2);
      const currentYear = new Date().getFullYear();

      if (countMember >= 10) {
        await this.prisma.user.update({
          where: {
            id: userBuyer.id,
          },
          data: {
            role: 'distributor',
            parentId: userSeller.parentId ? userSeller.parentId : userSeller.id,
          },
        });
        // * update history promoted
        await this.prisma.promotion.create({
          data: {
            from: userBuyer.role,
            to: 'distributor',
            promotionDate: new Date(
              `${currentYear}-${mo}-${date}`,
            ).toISOString(),
            userId: userBuyer.id,
          },
        });
      } else {
        await this.prisma.user.update({
          where: {
            id: userBuyer.id,
          },
          data: {
            role: 'reseller-up',
            parentId: userSeller.parentId ? userSeller.parentId : userSeller.id,
          },
        });
        // * update history promoted
        await this.prisma.promotion.create({
          data: {
            from: userBuyer.role,
            to: 'reseller-up',
            promotionDate: new Date(
              `${currentYear}-${mo}-${date}`,
            ).toISOString(),
            userId: userBuyer.id,
          },
        });
      }

      const titipanMember = await this.prisma.user.count({
        where: {
          AND: [
            {
              leaderSignedId: userBuyer.id,
            },
            {
              role: 'reseller',
            },
          ],
        },
      });

      if (titipanMember) {
        await this.prisma.user.updateMany({
          where: {
            AND: [
              {
                leaderSignedId: userBuyer.id,
              },
              {
                role: 'reseller',
              },
            ],
          },
          data: {
            parentId: userBuyer.id,
          },
        });
      }
    }

    return {
      message: 'Pembayaran brhasil dikonfirmasi!',
    };
  }

  async getOrder({
    limit,
    page,
    userData,
    q,
    userId,
    month,
    year,
  }: {
    page: number;
    limit: number;
    userData: User;
    q: string;
    year: string;
    month: string;
    userId?: number;
  }) {
    if (!year || !month) {
      throw new BadRequestException('year and month params required');
    }
    const lastDayOfMonth = new Date(
      parseInt(year),
      parseInt(month),
      0,
    ).getDate();

    const offset = limit * page - limit;

    const totalRows = await this.prisma.order.count({
      where: {
        userId: userId || userData.id,
        noOrder: {
          contains: q,
        },
        orderDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const orders = await this.prisma.order.findMany({
      where: {
        userId: userId || userData.id,
        noOrder: {
          contains: q,
        },
        orderDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const remainAmountOrder = await this.prisma.order.findMany({
      where: {
        userId: userId || userData.id,
        remainingAmount: {
          not: '0',
        },
      },
    });

    const remainingAmount = remainAmountOrder.reduce(
      (total, order) => total + parseInt(order.remainingAmount),
      0,
    );

    return {
      page,
      limit,
      totalRows,
      totalPage,
      remainingAmount,
      data: orders,
    };
  }

  async confirmOrder({
    id,
    userData,
    confimOrderDto,
  }: {
    id: number;
    userData: User;
    confimOrderDto: ConfirmOrderDto;
  }) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) {
      throw new BadRequestException('order not found');
    }

    if (order.isConfirm) {
      throw new BadRequestException('Orderan sudah dikonfirmasi');
    }

    const date = ('0' + new Date().getDate()).slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const countQty = confimOrderDto.cart.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.qty * 1;
    }, 0);

    // * check apakah stok tersedia
    if (!confimOrderDto.memberUserId) {
      const processTopLevel = confimOrderDto.cart.map(async (cart) => {
        try {
          const availableProduct = await this.prisma.product.findFirst({
            where: {
              AND: [
                {
                  userId: userData.id,
                },
                {
                  codeProduct: cart.codeProduct,
                },
              ],
            },
          });

          if (!availableProduct) {
            throw new NotFoundException('Ada produk yang tidak ditemukan');
          }

          await this.prisma.product.update({
            where: {
              id: availableProduct.id,
            },
            data: {
              stock:
                availableProduct.stock +
                (typeof cart.qty === 'string'
                  ? parseInt(cart.qty as any)
                  : cart.qty),
            },
          });
        } catch (error) {
          throw new Error(error.message);
        }
      });
      await Promise.all(processTopLevel);
      await this.prisma.income.create({
        data: {
          incomeDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
          type: 'outcome',
          value: order.totalPrice,
          remarks: 'Order',
          userId: userData.id,
          qty: countQty,
        },
      });
    } else {
      // * calculate fee
      const userBuyer = await this.prisma.user.findFirst({
        where: {
          id: confimOrderDto.memberUserId,
        },
      });

      const userLead = await this.prisma.user.findFirst({
        where: {
          id: userBuyer.leaderSignedId,
        },
      });

      if (userLead && userBuyer && userBuyer.leaderSignedId !== userData.id) {
        // * jika rolenya sama maka akan dapat fee
        const date = ('0' + new Date().getDate()).slice(-2);
        const currentMonth = new Date().getMonth() + 1;
        const mo = ('0' + currentMonth).slice(-2);
        const currentYear = new Date().getFullYear();
        if (
          userBuyer.role === userLead.role ||
          (userBuyer.role === 'distributor' &&
            userLead.role === 'reseller-up') ||
          (userBuyer.role === 'reseller-up' && userLead.role === 'distributor')
        ) {
          const totalQty = confimOrderDto.cart.reduce(
            (accumulator, currentValue) => {
              return accumulator + currentValue.qty * 1;
            },
            0,
          );
          await this.prisma.fee.create({
            data: {
              fee: (parseInt(FEE) * totalQty).toString(),
              orderId: order.id,
              userId: userBuyer.leaderSignedId,
              feeDate: new Date(`${currentYear}-${mo}-${date}`),
            },
          });
        } else {
          //* jika tidak sama maka akan di cek apakah sudah lebih dari 3 bulan
          const promotion = await this.prisma.promotion.findFirst({
            where: {
              AND: [
                {
                  from: userLead.role,
                },
                {
                  userId: userBuyer.id,
                },
              ],
            },
          });

          const currentDate = new Date();
          currentDate.setMonth(currentDate.getMonth() - 3);
          currentDate.setHours(0, 0, 0, 0);
          const threeMonthsAgoTimestamp = currentDate.getTime();

          if (
            promotion &&
            new Date(promotion.promotionDate).getTime() >
              threeMonthsAgoTimestamp
          ) {
            const totalQty = confimOrderDto.cart.reduce(
              (accumulator, currentValue) => {
                return accumulator + currentValue.qty * 1;
              },
              0,
            );

            await this.prisma.fee.create({
              data: {
                fee: (parseInt(FEE) * totalQty).toString(),
                orderId: order.id,
                userId: userBuyer.leaderSignedId,
                feeDate: new Date(`${currentYear}-${mo}-${date}`),
              },
            });
          }
        }
      }
      // * check stock parent
      const checkStock = confimOrderDto.cart.map(async (cart) => {
        try {
          const availableProduct = await this.prisma.product.findFirst({
            where: {
              AND: [
                {
                  userId: userData.id,
                },
                {
                  codeProduct: cart.codeProduct,
                },
              ],
            },
          });
          if (!availableProduct) {
            throw new NotFoundException('Ada produk yang tidak ditemukan');
          }

          if (availableProduct.stock < cart.qty) {
            throw new BadRequestException(
              `Aroma ${availableProduct.aromaLama}/${availableProduct.aromaBaru} melebihi batas, karena sisa stok ${availableProduct.stock}`,
            );
          }
        } catch (error) {
          throw new BadRequestException(error.message);
        }
      });
      await Promise.all(checkStock);

      // * process stock parent
      const reduceStockParent = confimOrderDto.cart.map(async (cart) => {
        try {
          const availableProduct = await this.prisma.product.findFirst({
            where: {
              AND: [
                {
                  userId: userData.id,
                },
                {
                  codeProduct: cart.codeProduct,
                },
              ],
            },
          });
          if (!availableProduct) {
            throw new NotFoundException('Ada produk yang tidak ditemukan');
          }

          await this.prisma.product.update({
            where: {
              id: availableProduct.id,
            },
            data: {
              stock:
                availableProduct.stock -
                (typeof cart.qty === 'string'
                  ? parseInt(cart.qty as any)
                  : cart.qty),
            },
          });
        } catch (error) {
          throw new Error(error.message);
        }
      });
      await Promise.all(reduceStockParent);

      // * process stock member
      const addStockMember = confimOrderDto.cart.map(async (cart) => {
        try {
          const availableProduct = await this.prisma.product.findFirst({
            where: {
              AND: [
                {
                  userId: confimOrderDto.memberUserId,
                },
                {
                  codeProduct: cart.codeProduct,
                },
              ],
            },
          });
          if (!availableProduct) {
            throw new NotFoundException('Ada produk yang tidak ditemukan');
          }

          await this.prisma.product.update({
            where: {
              id: availableProduct.id,
            },
            data: {
              stock:
                availableProduct.stock +
                (typeof cart.qty === 'string'
                  ? parseInt(cart.qty as any)
                  : cart.qty),
            },
          });
        } catch (error) {
          throw new Error(error.message);
        }
      });
      await Promise.all(addStockMember);

      const modal = parseInt(PRICE_MEMBER[userData.role]) * countQty;
      const income = parseInt(order.totalPrice) - modal;

      // * process income & outcome member
      await this.prisma.income.create({
        data: {
          incomeDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
          type: 'income',
          value: income.toString(),
          modal: modal.toString(),
          remarks: renderRole(userBuyer.role),
          userId: userData.id,
          name: userBuyer.name,
          qty: countQty,
        },
      });

      await this.prisma.income.create({
        data: {
          incomeDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
          type: 'outcome',
          value: order.totalPrice,
          remarks: 'Order',
          userId: userBuyer.id,
          qty: countQty,
        },
      });
    }

    if (order.isConfirm) {
      throw new BadRequestException('order sudah terkonfirmasi');
    }

    await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        isConfirm: true,
      },
    });

    return {
      message: 'Orderan berhasil dikonfirmasi',
    };
  }

  async deleteOrder(id: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) {
      throw new BadRequestException('order not found');
    }

    await this.prisma.order.delete({
      where: {
        id: order.id,
      },
    });

    return { message: `Order berhasil dihapus` };
  }

  async getClosing({
    limit,
    page,
    userData,
    q,
    userId,
    month,
    year,
  }: {
    page: number;
    limit: number;
    userData: User;
    q: string;
    year: string;
    month: string;
    userId?: number;
  }) {
    if (!year || !month) {
      throw new BadRequestException('year and month params required');
    }
    const lastDayOfMonth = new Date(
      parseInt(year),
      parseInt(month),
      0,
    ).getDate();

    const offset = limit * page - limit;

    const totalRows = await this.prisma.closing.count({
      where: {
        userId: userId || userData.id,
        noOrder: {
          contains: q,
        },
        orderDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const closing = await this.prisma.closing.findMany({
      where: {
        userId: userId || userData.id,
        noOrder: {
          contains: q,
        },
        orderDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
      include: {
        product: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      page,
      limit,
      totalRows,
      totalPage,
      data: closing,
    };
  }

  async addClosingOrder(addClosingDto: AddClosingDto, userData: User) {
    const noOrder = randomAlphanumeric.generate({
      capitalization: 'uppercase',
      charset: 'alphanumeric',
      length: 10,
    });

    const date = ('0' + new Date().getDate()).slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const newClosing = await this.prisma.closing.create({
      data: {
        noOrder,
        customerName: addClosingDto.customerName,
        qty: addClosingDto.qty,
        productId: addClosingDto.productId,
        totalPrice: addClosingDto.totalPrice,
        userId: userData.id,
        isConfirm: false,
        orderDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
      },
    });

    return {
      message: 'Orderan sudah ditambahkan, silahkan konfirmasi',
      data: newClosing,
    };
  }

  async confirmClosing(id: number, userData: User) {
    const availableClosing = await this.prisma.closing.findFirst({
      where: {
        id,
      },
    });

    if (!availableClosing) {
      throw new NotFoundException('Closingan tidak ditemukan');
    }

    if (availableClosing.isConfirm) {
      throw new BadRequestException('Closingan sudah dikonfirmasi');
    }

    const availableProduct = await this.prisma.product.findFirst({
      where: {
        id: availableClosing.productId,
      },
    });

    if (!availableProduct) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (availableProduct.stock < availableClosing.qty) {
      throw new BadRequestException('Stok tidak mencukupi');
    }

    // * confirm & denote stock

    await this.prisma.closing.update({
      where: {
        id: availableClosing.id,
      },
      data: {
        isConfirm: true,
      },
    });

    await this.prisma.product.update({
      where: {
        id: availableProduct.id,
      },
      data: {
        stock: availableProduct.stock - availableClosing.qty,
      },
    });

    const modal = parseInt(PRICE_MEMBER[userData.role]) * availableClosing.qty;
    const income = parseInt(availableClosing.totalPrice) - modal;

    const date = ('0' + new Date().getDate()).slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    // * process income
    await this.prisma.income.create({
      data: {
        incomeDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
        type: 'income',
        value: income.toString(),
        modal: modal.toString(),
        remarks: 'Customer',
        userId: userData.id,
        name: availableClosing.customerName,
        qty: availableClosing.qty,
      },
    });

    return {
      message: 'Closingan berhasil dikonfirmasi!',
    };
  }

  async deleteClosing(id: number) {
    const availableClosing = await this.prisma.closing.findFirst({
      where: {
        id,
      },
    });

    if (!availableClosing) {
      throw new NotFoundException('Closingan tidak ditemukan');
    }

    await this.prisma.closing.delete({
      where: {
        id: availableClosing.id,
      },
    });

    return {
      message: 'Closingan berhasil dihapus!',
    };
  }

  async getFees({
    limit,
    page,
    userData,
    userId,
    month,
    year,
  }: {
    page: number;
    limit: number;
    userData: User;
    year: string;
    month: string;
    userId?: number;
  }) {
    if (!year || !month) {
      throw new BadRequestException('year and month params required');
    }
    const lastDayOfMonth = new Date(
      parseInt(year),
      parseInt(month),
      0,
    ).getDate();

    const offset = limit * page - limit;

    const totalRows = await this.prisma.fee.count({
      where: {
        userId: userId || userData.id,
        feeDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const fees = await this.prisma.fee.findMany({
      where: {
        userId: userId || userData.id,
        feeDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
      include: {
        order: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalFee = fees.reduce(
      (total, order) => total + parseInt(order.fee),
      0,
    );

    return {
      page,
      limit,
      totalRows,
      totalPage,
      data: fees,
      totalFee,
    };
  }

  async getProfit({
    limit,
    page,
    userData,
    month,
    year,
  }: {
    page: number;
    limit: number;
    userData: User;
    year: string;
    month: string;
  }) {
    if (!year || !month) {
      throw new BadRequestException('year and month params required');
    }
    const lastDayOfMonth = new Date(
      parseInt(year),
      parseInt(month),
      0,
    ).getDate();

    const offset = limit * page - limit;

    const totalRows = await this.prisma.income.count({
      where: {
        userId: userData.id,
        incomeDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const profit = await this.prisma.income.findMany({
      where: {
        userId: userData.id,
        incomeDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const incomes = profit.filter((prof) => prof.type === 'income');
    const outcomes = profit.filter((prof) => prof.type === 'outcome');

    const totalIncome = incomes.reduce(
      (total, inc) => total + parseInt(inc.value),
      0,
    );
    const totalOutcome = outcomes.reduce(
      (total, inc) => total + parseInt(inc.value),
      0,
    );
    const totalQtyIncome = incomes.reduce((total, inc) => total + inc.qty, 0);
    const totalQtyOutcome = outcomes.reduce((total, inc) => total + inc.qty, 0);

    return {
      page,
      limit,
      totalRows,
      totalPage,
      data: profit,
      totalIncome,
      totalOutcome,
      totalQtyIncome,
      totalQtyOutcome,
      totalProfit: totalIncome - totalOutcome,
    };
  }

  async createPayment(paymentOrderDto: PaymentOrderDto, userData: User) {
    const date = ('0' + new Date().getDate()).slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const availableOrder = await this.prisma.order.findFirst({
      where: {
        id: paymentOrderDto.idOrder,
      },
    });

    if (!availableOrder) {
      throw new NotFoundException('Orderan tidak ditemukan');
    }

    await this.prisma.payment.create({
      data: {
        amountCash: paymentOrderDto.amountCash || null,
        amountTrf: paymentOrderDto.amountTrf || null,
        userId: userData.id,
        isConfirm: false,
        paymentDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
        orderId: availableOrder.id,
      },
    });

    return {
      message: 'Pembayaran berhasil, silahkan minta konfirmasi',
    };
  }

  async editPayment(paymentOrderDto: EditPaymentOrderDto, idPayment: number) {
    const availablePayment = await this.prisma.payment.findFirst({
      where: {
        id: idPayment,
      },
    });

    if (!availablePayment) {
      throw new NotFoundException('Payment tidak ditemukan');
    }

    await this.prisma.payment.update({
      where: {
        id: availablePayment.id,
      },
      data: {
        amountCash: paymentOrderDto.amountCash,
        amountTrf: paymentOrderDto.amountTrf,
      },
    });

    return {
      message: 'Pembayaran berhasil diubah, silahkan minta konfirmasi',
    };
  }

  async getPayment({
    limit,
    page,
    userData,
    userId,
    month,
    year,
  }: {
    page: number;
    limit: number;
    userData: User;
    year: string;
    month: string;
    userId?: number;
  }) {
    if (!year || !month) {
      throw new BadRequestException('year and month params required');
    }
    const lastDayOfMonth = new Date(
      parseInt(year),
      parseInt(month),
      0,
    ).getDate();

    const offset = limit * page - limit;

    const totalRows = await this.prisma.payment.count({
      where: {
        userId: userId || userData.id,
        paymentDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);
    const payments = await this.prisma.payment.findMany({
      where: {
        userId: userId || userData.id,
        paymentDate: {
          lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
          gte: new Date(`${year}-${month}-01`),
        },
      },
      include: {
        order: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      page,
      limit,
      totalRows,
      totalPage,
      data: payments,
    };
  }

  async deletePayment(id: number) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id,
      },
    });

    if (!payment) {
      throw new BadRequestException('payment not found');
    }

    await this.prisma.payment.delete({
      where: {
        id: payment.id,
      },
    });

    return { message: `Payment berhasil dihapus` };
  }
}
