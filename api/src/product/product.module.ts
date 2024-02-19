import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    ConfigService,
    UsersService,
    AuthService,
    JwtService,
  ],
})
export class ProductModule {}
