import {
  Controller,
  Post,
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
}
