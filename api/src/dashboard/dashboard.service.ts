import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async getTotalMember(userData: User) {
    const countMember = await this.prisma.user.count({
      where: {
        leaderSignedId: userData.id,
      },
    });

    return { countMember };
  }

  async getTotalProfit(userData: User) {
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const lastDayOfMonth = new Date(currentYear, parseInt(mo), 0).getDate();

    const profit = await this.prisma.income.findMany({
      where: {
        userId: userData.id,
        incomeDate: {
          lte: new Date(`${currentYear}-${mo}-${lastDayOfMonth}`),
          gte: new Date(`${currentYear}-${mo}-01`),
        },
      },
    });

    const incomes = profit.filter((prof) => prof.type === 'income');
    const outcomes = profit.filter((prof) => prof.type === 'outcome');

    const totalIncome = incomes.reduce(
      (total, inc) => total + parseInt(inc.value),
      0,
    );
    const totalOutcome = outcomes.reduce(
      (total, inc) => total + parseInt(inc.value),
      0,
    );

    return { totalIncome, totalOutcome };
  }

  async getTotalQtyOrder(userData: User) {
    const currentMonth = new Date().getMonth() + 1;
    const mo = ('0' + currentMonth).slice(-2);
    const currentYear = new Date().getFullYear();

    const lastDayOfMonth = new Date(currentYear, parseInt(mo), 0).getDate();

    const orders = await this.prisma.order.findMany({
      where: {
        sellerId: userData.id,
        orderDate: {
          lte: new Date(`${currentYear}-${mo}-${lastDayOfMonth}`),
          gte: new Date(`${currentYear}-${mo}-01`),
        },
      },
    });

    return orders;
  }

  async getProfitSixMonth(userData: User) {
    const currentDate = new Date();
    const result = [];
    const value = [];
    const monthKey = [];

    for (let i = 0; i < 6; i++) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const lastDayOfMonth = new Date(year, month, 0).getDate();

      const profit = await this.prisma.income.findMany({
        where: {
          userId: userData.id,
          incomeDate: {
            lte: new Date(`${year}-${month}-${lastDayOfMonth}`),
            gte: new Date(`${year}-${month}-01`),
          },
        },
      });

      const incomes = profit.filter((prof) => prof.type === 'income');
      const outcomes = profit.filter((prof) => prof.type === 'outcome');

      const totalIncome = incomes.reduce(
        (total, inc) => total + parseInt(inc.value),
        0,
      );
      const totalOutcome = outcomes.reduce(
        (total, inc) => total + parseInt(inc.value),
        0,
      );

      result.push({
        year,
        month: MONTHS[month - 1],
        totalIncome,
        totalOutcome,
      });
      monthKey.push(MONTHS[month - 1]);
      value.push(totalIncome - totalOutcome);
    }

    return {
      month: monthKey,
      value,
      data: result,
    };
  }

  async getStock(userData: User) {
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

    return { totalStock };
  }
}
