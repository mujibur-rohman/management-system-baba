import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @UseGuards(AccessTokenGuard)
  @Get('/count-member')
  async countMember(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.dashboardService.getTotalMember(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/profit-count')
  async profitCount(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.dashboardService.getTotalProfit(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/profit-count-six-months')
  async profitCountSixMonths(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.dashboardService.getProfitSixMonth(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/qty-count-six-months')
  async getTotalQtyOrder(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.dashboardService.getTotalQtyOrder(request.user as User);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/count-stock')
  async countStock(@Req() request: Request) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.dashboardService.getStock(request.user as User);
  }
}
