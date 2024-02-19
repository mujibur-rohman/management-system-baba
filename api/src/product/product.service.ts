import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import PRODUCT_DATA from 'src/config/product-setting';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async generateProduct(userData: User) {
    const mappingGenerateBaru = PRODUCT_DATA.BARU.map(async (product) => {
      await this.prisma.product.create({
        data: {
          userId: userData.id,
          aroma: 'BARU',
          name: product,
          stock: 0,
        },
      });
    });

    const mappingGenerateLama = PRODUCT_DATA.LAMA.map(async (product) => {
      await this.prisma.product.create({
        data: {
          userId: userData.id,
          aroma: 'LAMA',
          name: product,
          stock: 0,
        },
      });
    });

    await Promise.all(mappingGenerateBaru);
    await Promise.all(mappingGenerateLama);

    return {
      message: 'Data berhasil digenerate',
    };
  }

  async processGenerate(dataProduct: {
    userId: string;
    aroma: string;
    name: string;
    stock: number;
  }) {
    await this.prisma.product.create({
      data: {
        userId: parseInt(dataProduct.userId),
        aroma: dataProduct.aroma,
        name: dataProduct.name,
        stock: dataProduct.stock,
      },
    });
  }
}
