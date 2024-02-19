import {
  BadRequestException,
  Body,
  Controller,
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
  @Put('/:id/stock')
  async updateStock(@Body() body: { stock: number }, @Param('id') id: string) {
    if (!body || !id) {
      throw new BadRequestException('stok dan id wajib dikirim');
    }

    console.log(body);
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
    @Query('type') type: 'BARU' | 'LAMA' = 'BARU',
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return await this.productService.getProducts({
      limit,
      page,
      q,
      type,
      userData: request.user as User,
    });
  }
}
