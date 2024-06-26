import {
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
import { OrderService } from './order.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import {
  AddClosingDto,
  ConfirmOrderDto,
  CreateOrderDto,
  EditOrderDto,
  EditPaymentOrderDto,
  PaymentOrderDto,
} from './dto/order.dto';
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
  @Put('/amount/:id')
  async amountOrder(@Param('id') idPayment: string) {
    const result = await this.orderService.amountOrder(parseInt(idPayment));

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getOrders(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q: string = '',
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('userId') userId?: string,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.getOrder({
      limit: limit * 1,
      page: page * 1,
      userData: request.user as any,
      q,
      userId: parseInt(userId),
      year,
      month,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/confirm/:id')
  async comfirmOrder(
    @Req() request: Request,
    @Param('id') idOrder: string,
    @Body() confimOrderDto: ConfirmOrderDto,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.confirmOrder({
      userData: request.user as any,
      confimOrderDto,
      id: parseInt(idOrder),
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteOrder(@Param('id') idOrder: string) {
    return await this.orderService.deleteOrder(parseInt(idOrder));
  }

  @UseGuards(AccessTokenGuard)
  @Post('/closing')
  async createClosing(
    @Body() addClosingDto: AddClosingDto,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const result = await this.orderService.addClosingOrder(
      addClosingDto,
      request.user as User,
    );
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('/closing')
  async getClosing(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q: string = '',
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('userId') userId?: string,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.getClosing({
      limit: limit * 1,
      page: page * 1,
      userData: request.user as any,
      q,
      userId: parseInt(userId),
      year,
      month,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/confirm-closing/:id')
  async confirmClosing(@Req() request: Request, @Param('id') idOrder: string) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.confirmClosing(
      parseInt(idOrder),
      request.user as any,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/closing/:id')
  async deleteClosing(@Param('id') idClosing: string) {
    return await this.orderService.deleteClosing(parseInt(idClosing));
  }

  @UseGuards(AccessTokenGuard)
  @Get('/fee')
  async getFees(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('userId') userId?: string,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.getFees({
      limit: limit * 1,
      page: page * 1,
      userData: request.user as any,
      userId: parseInt(userId),
      year,
      month,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/profit')
  async getProfits(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.getProfit({
      limit: limit * 1,
      page: page * 1,
      userData: request.user as any,
      year,
      month,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/payment')
  async getPayments(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('userId') userId?: string,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.orderService.getPayment({
      limit: limit * 1,
      page: page * 1,
      userData: request.user as any,
      userId: parseInt(userId),
      year,
      month,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/payment')
  async createPayment(
    @Body() paymentOrderDto: PaymentOrderDto,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const result = await this.orderService.createPayment(
      paymentOrderDto,
      request.user as User,
    );
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/payment/:id')
  async updatePayment(
    @Body() editPayment: EditPaymentOrderDto,
    @Param('id') idPayment: string,
  ) {
    const result = await this.orderService.editPayment(
      editPayment,
      parseInt(idPayment),
    );

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/payment/:id')
  async deletePayment(@Param('id') idOrder: string) {
    return await this.orderService.deletePayment(parseInt(idOrder));
  }
}
