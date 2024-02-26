import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    ProductService,
    ConfigService,
    UsersService,
    AuthService,
    JwtService,
  ],
})
export class OrderModule {}
