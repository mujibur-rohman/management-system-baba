import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import PRODUCT_DATA from 'src/config/product-setting';
import {
  AddSwitchProductDto,
  AddToCartDto,
  ArrEditCartDto,
  ConfirmSwitchProductDto,
} from './dto/product.dto';

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

    const mappingGenerate = PRODUCT_DATA.map(async (product) => {
      await this.prisma.product.create({
        data: {
          userId: userData.id,
          aromaLama: product[0],
          aromaBaru: product[1],
          codeProduct: product[2],
          stock: 0,
        },
      });
    });

    await Promise.all(mappingGenerate);

    return {
      message: 'Data berhasil digenerate',
    };
  }

  async getProducts({
    limit,
    page,
    q,
    userData,
  }: {
    q: string;
    page: number;
    limit: number;
    userData: User;
  }) {
    const offset = limit * page - limit;

    const totalRows = await this.prisma.product.count({
      where: {
        userId: userData.id,
        OR: [
          {
            aromaBaru: {
              contains: q,
            },
          },
          {
            aromaLama: {
              contains: q,
            },
          },
        ],
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const products = await this.prisma.product.findMany({
      where: {
        userId: userData.id,
        OR: [
          {
            aromaBaru: {
              contains: q,
            },
          },
          {
            aromaLama: {
              contains: q,
            },
          },
        ],
      },
      skip: offset,
      take: limit * 1,
      orderBy: {
        aromaLama: 'asc',
      },
      include: {
        cart: true,
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

  async getProductsParent({
    limit,
    page,
    q,
    userData,
  }: {
    q: string;
    page: number;
    limit: number;
    userData: User;
  }) {
    const offset = limit * page - limit;

    const totalRows = await this.prisma.product.count({
      where: {
        userId: userData.parentId,
        OR: [
          {
            aromaBaru: {
              contains: q,
            },
          },
          {
            aromaLama: {
              contains: q,
            },
          },
        ],
        stock: {
          gt: 0,
        },
      },
    });

    const totalPage = Math.ceil(totalRows / limit);

    const products = await this.prisma.product.findMany({
      where: {
        userId: userData.parentId,
        OR: [
          {
            aromaBaru: {
              contains: q,
            },
          },
          {
            aromaLama: {
              contains: q,
            },
          },
        ],
        stock: {
          gt: 0,
        },
      },
      skip: offset,
      take: limit * 1,
      orderBy: {
        aromaLama: 'asc',
      },
      include: {
        cart: true,
      },
    });

    return {
      page: page * 1,
      limit: limit * 1,
      totalRows,
      totalPage,
      data: products,
    };
  }

  async getProductsParentAll({ userData }: { userData: User }) {
    const products = await this.prisma.product.findMany({
      where: {
        userId: userData.parentId,
        stock: {
          gt: 0,
        },
      },
      orderBy: {
        aromaLama: 'asc',
      },
      include: {
        cart: true,
      },
    });

    return products;
  }

  async getProductsAll({ userData }: { userData: User }) {
    const products = await this.prisma.product.findMany({
      where: {
        userId: userData.id,
        stock: {
          gt: 0,
        },
      },
      orderBy: {
        aromaLama: 'asc',
      },
      include: {
        cart: true,
      },
    });

    return products;
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

    const availableProduct = await this.prisma.product.findFirst({
      where: {
        id: cartDto.productId,
      },
    });
    if (!availableProduct) {
      throw new NotFoundException('Ada produk yang tidak ditemukan');
    }

    await this.prisma.cart.create({
      data: {
        productId: cartDto.productId,
        price: cartDto.price,
        qty: cartDto.qty,
        userId: userData.id,
        codeProduct: availableProduct.codeProduct,
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

  async getCart(userData: User) {
    const carts = await this.prisma.cart.findMany({
      where: {
        userId: userData.id,
      },
      include: {
        product: true,
      },
    });

    return {
      data: carts,
    };
  }

  async addSwitchProduct(userData: User, addSwitchDto: AddSwitchProductDto) {
    const date = ('0' + new Date().getDate()).slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const getNameProdNew = await this.prisma.product.findFirst({
      where: {
        AND: [
          {
            codeProduct: addSwitchDto.newCodeProduct,
          },
          {
            userId: userData.id,
          },
        ],
      },
    });
    const getNameProdOld = await this.prisma.product.findFirst({
      where: {
        AND: [
          {
            codeProduct: addSwitchDto.oldCodeProduct,
          },
          {
            userId: userData.id,
          },
        ],
      },
    });

    if (addSwitchDto.oldCodeProduct === addSwitchDto.newCodeProduct) {
      throw new BadRequestException('Produk yang ditukar sama');
    }

    await this.prisma.switchProduct.create({
      data: {
        userId: userData.id,
        newCodeProduct: addSwitchDto.newCodeProduct,
        oldCodeProduct: addSwitchDto.oldCodeProduct,
        sellerId: userData.parentId || null,
        qty: addSwitchDto.qty,
        isConfirm: false,
        newNameProd:
          getNameProdNew &&
          `${getNameProdNew.aromaLama} / ${getNameProdNew.aromaBaru}`,
        oldNameProd:
          getNameProdOld &&
          `${getNameProdOld.aromaLama} / ${getNameProdOld.aromaBaru}`,
        switchDate: new Date(`${currentYear}-${mo}-${date}`).toISOString(),
      },
    });

    return {
      message: 'Pengajuan tukar aroma berhasil, tunggu untuk dikonfirmasi!',
    };
  }

  async confirmSwitchProduct(
    id: number,
    userData: User,
    confirmSwitchProductDto: ConfirmSwitchProductDto,
  ) {
    if (!confirmSwitchProductDto.memberId) {
      const availableOldProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            {
              userId: userData.id, // yang login (parentnya)
            },
            {
              codeProduct: confirmSwitchProductDto.oldCodeProduct,
            },
          ],
        },
      });

      if (!availableOldProduct) {
        throw new NotFoundException('Produk lama tidak ditemukan');
      }

      if (availableOldProduct.stock < confirmSwitchProductDto.qty) {
        throw new BadRequestException(
          `Aroma ${availableOldProduct.aromaLama}/${availableOldProduct.aromaBaru} tidak bisa ditukan dengan jumlah ${confirmSwitchProductDto.qty}, karena sisa stok ${availableOldProduct.stock}`,
        );
      }

      await this.prisma.product.update({
        where: {
          id: availableOldProduct.id,
        },
        data: {
          stock: availableOldProduct.stock - confirmSwitchProductDto.qty,
        },
      });

      const availableNewProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            {
              userId: userData.id, // yang login (parentnya)
            },
            {
              codeProduct: confirmSwitchProductDto.newCodeProduct,
            },
          ],
        },
      });

      if (!availableNewProduct) {
        throw new NotFoundException('Produk baru tidak ditemukan');
      }

      await this.prisma.product.update({
        where: {
          id: availableNewProduct.id,
        },
        data: {
          stock: availableNewProduct.stock + confirmSwitchProductDto.qty,
        },
      });
    } else {
      // * proses leader product switch
      const availableParentOldProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            {
              userId: userData.id,
            },
            {
              codeProduct: confirmSwitchProductDto.oldCodeProduct,
            },
          ],
        },
      });

      if (!availableParentOldProduct) {
        throw new NotFoundException('Produk leader tidak ditemukan');
      }

      const availableParentNewProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            {
              userId: userData.id,
            },
            {
              codeProduct: confirmSwitchProductDto.newCodeProduct,
            },
          ],
        },
      });

      if (!availableParentNewProduct) {
        throw new NotFoundException('Produk leader tidak ditemukan');
      }

      if (availableParentNewProduct.stock < confirmSwitchProductDto.qty) {
        throw new BadRequestException(
          `Aroma ${availableParentNewProduct.aromaLama}/${availableParentNewProduct.aromaBaru} tidak bisa ditukar dengan jumlah ${confirmSwitchProductDto.qty}, karena sisa stok ${availableParentNewProduct.stock}`,
        );
      }

      // * proses member product switch

      const availableMemberNewProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            {
              userId: confirmSwitchProductDto.memberId,
            },
            {
              codeProduct: confirmSwitchProductDto.newCodeProduct,
            },
          ],
        },
      });

      if (!availableMemberNewProduct) {
        throw new NotFoundException('Produk member tidak ditemukan');
      }

      const availableMemberOldProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            {
              userId: confirmSwitchProductDto.memberId,
            },
            {
              codeProduct: confirmSwitchProductDto.oldCodeProduct,
            },
          ],
        },
      });

      if (!availableMemberOldProduct) {
        throw new NotFoundException('Produk member tidak ditemukan');
      }

      if (availableMemberOldProduct.stock < confirmSwitchProductDto.qty) {
        throw new BadRequestException(
          `Aroma ${availableMemberOldProduct.aromaLama}/${availableMemberOldProduct.aromaBaru} tidak bisa ditukan dengan jumlah ${confirmSwitchProductDto.qty}, karena sisa stok ${availableMemberOldProduct.stock}`,
        );
      }

      await this.prisma.product.update({
        where: {
          id: availableParentOldProduct.id,
        },
        data: {
          stock: availableParentOldProduct.stock + confirmSwitchProductDto.qty,
        },
      });

      await this.prisma.product.update({
        where: {
          id: availableParentNewProduct.id,
        },
        data: {
          stock: availableParentNewProduct.stock - confirmSwitchProductDto.qty,
        },
      });

      await this.prisma.product.update({
        where: {
          id: availableMemberNewProduct.id,
        },
        data: {
          stock: availableMemberNewProduct.stock + confirmSwitchProductDto.qty,
        },
      });

      await this.prisma.product.update({
        where: {
          id: availableMemberOldProduct.id,
        },
        data: {
          stock: availableMemberOldProduct.stock - confirmSwitchProductDto.qty,
        },
      });
    }

    const switchProduct = await this.prisma.switchProduct.findFirst({
      where: {
        id,
      },
    });

    if (!switchProduct) {
      throw new BadRequestException('switch product not found');
    }

    if (switchProduct.isConfirm) {
      throw new BadRequestException('sudah terkonfirmasi');
    }

    await this.prisma.switchProduct.update({
      where: {
        id: switchProduct.id,
      },
      data: {
        isConfirm: true,
      },
    });

    return {
      message: 'Tukar aroma dikonfirmasi!',
    };
  }

  async getSwitchProduct({
    limit,
    page,
    userData,
    type = 'self',
  }: {
    page: number;
    limit: number;
    userData: User;
    type?: 'self' | 'team';
  }) {
    if (type === 'self') {
      const offset = limit * page - limit;

      const totalRows = await this.prisma.switchProduct.count({
        where: {
          userId: userData.id,
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const switchProducts = await this.prisma.switchProduct.findMany({
        where: {
          userId: userData.id,
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
        data: switchProducts,
      };
    } else if (type === 'team') {
      const offset = limit * page - limit;

      const totalRows = await this.prisma.switchProduct.count({
        where: {
          sellerId: userData.id,
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const switchProducts = await this.prisma.switchProduct.findMany({
        where: {
          sellerId: userData.id,
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
        },
      });
      return {
        page,
        limit,
        totalRows,
        totalPage,
        data: switchProducts,
      };
    } else {
      throw new BadRequestException('type must be self or team');
    }
  }

  async deleteSwitch(id: number) {
    const availableSwitch = await this.prisma.switchProduct.findFirst({
      where: {
        id,
      },
    });

    if (!availableSwitch) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    await this.prisma.switchProduct.delete({
      where: {
        id: availableSwitch.id,
      },
    });

    return {
      message: 'Data berhasil dihapus!',
    };
  }
}
