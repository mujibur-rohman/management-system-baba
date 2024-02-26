import {
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
import { OrderService } from './order.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { CreateOrderDto, EditOrderDto } from './dto/order.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const result = await this.orderService.createOrder(
      request.user as User,
      createOrderDto,
    );
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  async updateOrder(
    @Body() editOrderDto: EditOrderDto,
    @Param('id') idOrder: string,
  ) {
    const result = await this.orderService.updateOrder(
      parseInt(idOrder),
      editOrderDto,
    );

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getOrders(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q: string = '',
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.getOrder({
      limit: limit * 1,
      page: page * 1,
      userData: request as any,
      q,
    });
  }
}
