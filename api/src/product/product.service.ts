import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import PRODUCT_DATA from 'src/config/product-setting';
import { AddToCartDto, ArrEditCartDto } from './dto/product.dto';

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
      take: limit * 1,
      orderBy: {
        name: 'asc',
      },
    });

    // * count stock
    const stockProduct = await this.prisma.product.findMany({
      where: {
        userId: userData.id,
        stock: {
          gt: 0,
        },
      },
    });

    const totalStock = stockProduct.reduce(
      (total, product) => total + product.stock,
      0,
    );

    return {
      page: page * 1,
      limit: limit * 1,
      totalRows,
      totalPage,
      totalStock,
      data: products,
    };
  }

  async addProductToCart({
    cartDto,
    userData,
  }: {
    cartDto: AddToCartDto;
    userData: User;
  }) {
    const availableCart = await this.prisma.cart.findFirst({
      where: {
        productId: cartDto.productId,
        userId: userData.id,
      },
    });

    if (availableCart) {
      throw new BadRequestException('Produk Sudah Ada Dipesanan');
    }

    await this.prisma.cart.create({
      data: {
        productId: cartDto.productId,
        price: cartDto.price,
        qty: cartDto.qty,
        userId: userData.id,
      },
    });

    return {
      message: 'Berhasil masuk ke pesanan, coba liat!',
    };
  }

  async deleteCart(cartId: number) {
    await this.prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    return {
      message: 'Pesanan sudah di hapus ya!',
    };
  }

  async editCart(cartDto: ArrEditCartDto) {
    let errorData = 0;
    const promises = cartDto.data.map(async (cart) => {
      try {
        const availableCart = await this.prisma.cart.findFirst({
          where: {
            id: cart.id,
          },
          include: {
            product: true,
          },
        });

        if (!availableCart) {
          throw new NotFoundException('Ada pesanan yang tidak ditemukan');
        }

        await this.prisma.cart.update({
          where: {
            id: cart.id,
          },
          data: {
            price: cart.price,
            qty: cart.qty,
          },
        });
      } catch (error) {
        errorData++;
      }
    });

    await Promise.all(promises);

    if (errorData > 0) {
      return {
        message: `Udah di save ya!, ada ${errorData} data yang gagal`,
      };
    } else {
      return {
        message: 'Udah di save ya!',
      };
    }
  }
}
