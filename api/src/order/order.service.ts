import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderDto } from './dto/order.dto';
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
      message: 'order has created!',
    };
  }

  async getOrder({
    limit,
    page,
    userData,
  }: {
    page: number;
    limit: number;
    userData: User;
  }) {
    const offset = limit * page - limit;

    const totalRows = await this.prisma.order.count({
      where: {
        userId: userData.id,
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const orders = await this.prisma.order.findMany({
      where: {
        userId: userData.id,
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
}
