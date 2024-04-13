import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { MemberService } from 'src/member/member.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    TodoService,
    DashboardService,
    MemberService,
    PrismaService,
    ConfigService,
    UsersService,
    AuthService,
    JwtService,
  ],
  controllers: [TodoController],
})
export class TodoModule {}
