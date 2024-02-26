import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfirmOrderDto, CreateOrderDto, EditOrderDto } from './dto/order.dto';
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
        cartData: JSON.stringify(carts.data, null, 2),
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

  async getOrder({
    limit,
    page,
    userData,
    q,
  }: {
    page: number;
    limit: number;
    userData: User;
    q: string;
  }) {
    const offset = limit * page - limit;

    const totalRows = await this.prisma.order.count({
      where: {
        userId: userData.id,
        noOrder: {
          contains: q,
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const orders = await this.prisma.order.findMany({
      where: {
        userId: userData.id,
        noOrder: {
          contains: q,
        },
      },
      skip: offset,
      take: limit,
      orderBy: {
        orderDate: 'asc',
      },
    });

    return {
      page,
      limit,
      totalRows,
      totalPage,
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
      throw new BadRequestException('order sudah terkonfirmasi');
    }

    if (userData.parentId) {
      return {
        message: 'cek stok dulu',
      };
    }

    console.log(confimOrderDto.cart);

    await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        isConfirm: true,
      },
    });

    // * update stok user
    let errorData = 0;
    const promises = confimOrderDto.cart.map(async (cart) => {
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
            stock: availableProduct.stock + cart.qty,
          },
        });
      } catch (error) {
        errorData++;
      }
    });

    await Promise.all(promises);

    if (errorData > 0) {
      return {
        message: `Orderan berhasil dikonfirmasi!, ada ${errorData} produk yang gagal`,
      };
    } else {
      return {
        message: 'Orderan berhasil dikonfirmasi',
      };
    }
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
