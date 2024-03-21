import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MemberService } from 'src/member/member.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    MemberService,
    PrismaService,
    ConfigService,
    UsersService,
    AuthService,
    JwtService,
  ],
})
export class DashboardModule {}
