import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import {
  AddSwitchProductDto,
  AddToCartDto,
  ArrEditCartDto,
  ConfirmSwitchProductDto,
} from './dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/generate')
  async generateProduct(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return await this.productService.generateProduct(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/update')
  async updateProduct(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return await this.productService.updateProduct(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/reset')
  async resetProduct(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return await this.productService.resetProduct(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/cart')
  async getCarts(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.productService.getCart(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/cart')
  async addToCart(@Req() request: Request, @Body() cartDto: AddToCartDto) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.productService.addProductToCart({
      cartDto,
      userData: request.user as User,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Put('/cart/update')
  async editCart(@Req() request: Request, @Body() cartDto: ArrEditCartDto) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.productService.editCart(cartDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/cart/delete/:id')
  async deleteCart(@Param('id') id: string) {
    return await this.productService.deleteCart(parseInt(id));
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id/stock')
  async updateStock(@Body() body: { stock: number }, @Param('id') id: string) {
    if (!body || !id) {
      throw new BadRequestException('stok dan id wajib dikirim');
    }

    return await this.productService.updateStock({
      productId: parseInt(id),
      stock: body.stock,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getProduct(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q: string = '',
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return await this.productService.getProducts({
      limit,
      page,
      q,
      userData: request.user as User,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/all')
  async getProductAll(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return await this.productService.getProductsAll({
      userData: request.user as User,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/parent')
  async getProductParent(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q: string = '',
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const userData = request.user as User;
    if (userData.parentId) {
      return await this.productService.getProductsParent({
        limit,
        page,
        q,
        userData: request.user as User,
      });
    } else {
      return await this.productService.getProducts({
        limit,
        page,
        q,
        userData: request.user as User,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('/parent-all')
  async getProductParentAll(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const userData = request.user as User;
    if (userData.parentId) {
      return await this.productService.getProductsParentAll({
        userData: request.user as User,
      });
    } else {
      return await this.productService.getProductsAll({
        userData: request.user as User,
      });
    }
  }

  @UseGuards(AccessTokenGuard)
  @Post('/add-switch')
  async createOrder(
    @Body() addSwitchProductDto: AddSwitchProductDto,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const result = await this.productService.addSwitchProduct(
      request.user as User,
      addSwitchProductDto,
    );

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/switch-confirm/:id')
  async comfirmOrder(
    @Req() request: Request,
    @Param('id') idSwitch: string,
    @Body() confimSwitchDto: ConfirmSwitchProductDto,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.productService.confirmSwitchProduct(
      parseInt(idSwitch),
      request.user as any,
      confimSwitchDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get('/switches')
  async getSwitchProducts(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type: string = 'self',
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.productService.getSwitchProduct({
      limit: limit * 1,
      page: page * 1,
      userData: request.user as any,
      type: type as 'self' | 'team',
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/switch/delete/:id')
  async deleteSwitch(@Param('id') id: string) {
    return await this.productService.deleteSwitch(parseInt(id));
  }
}
