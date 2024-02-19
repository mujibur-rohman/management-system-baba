import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async updateStock({
    productId,
    stock,
  }: {
    productId: number;
    stock: number;
  }) {
    const availableProduct = await this.prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!availableProduct) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    await this.prisma.product.update({
      where: {
        id: availableProduct.id,
      },
      data: {
        stock,
      },
    });

    return {
      message: `Stok berhasil diubah menjadi ${stock}`,
    };
  }

  async generateProduct(userData: User) {
    const countProduct = await this.prisma.product.count({
      where: {
        userId: userData.id,
      },
    });

    if (countProduct > 0) {
      throw new BadRequestException('Anda sudah generate produk sebelumnya');
    }

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

  async getProducts({
    limit,
    page,
    q,
    type,
    userData,
  }: {
    q: string;
    page: number;
    limit: number;
    type: 'LAMA' | 'BARU';
    userData: User;
  }) {
    const offset = limit * page - limit;

    const totalRows = await this.prisma.product.count({
      where: {
        userId: userData.id,
        name: {
          contains: q,
        },
        aroma: type,
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const products = await this.prisma.product.findMany({
      where: {
        userId: userData.id,
        name: {
          contains: q,
        },
        aroma: type,
      },
      skip: offset,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    });

    return {
      page,
      limit,
      totalRows,
      totalPage,
      data: products,
    };
  }
}
