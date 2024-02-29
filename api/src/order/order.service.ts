import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import {
  AmountOrderDto,
  ConfirmOrderDto,
  CreateOrderDto,
  EditOrderDto,
} from './dto/order.dto';
import { ProductService } from 'src/product/product.service';
import { User } from '@prisma/client';

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

  async amountOrder(idOrder: number, amountDto: AmountOrderDto) {
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
        remainingAmount: amountDto.remainingAmount,
        amountCash: (
          parseInt(availableOrder.amountCash) + parseInt(amountDto.amountCash)
        ).toString(),
        amountTrf: (
          parseInt(availableOrder.amountTrf) + parseInt(amountDto.amountTrf)
        ).toString(),
        cartData: availableOrder.cartData,
      },
    });

    return {
      message: 'Pembayaran di update!',
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
    // * check apakah stok tersedia
    if (!confimOrderDto.memberUserId) {
      const processTopLevel = confimOrderDto.cart.map(async (cart) => {
        try {
          const availableProduct = await this.prisma.product.findFirst({
            where: {
              id: cart.productId,
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
    } else {
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

          console.log(availableProduct, userData);

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
    }

    const order = await this.prisma.order.findFirst({
      where: {
        id,
      },
    });

    if (!order) {
      throw new BadRequestException('order not found');
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
}
