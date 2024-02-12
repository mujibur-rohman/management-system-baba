import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MemberController],
  providers: [
    MemberService,
    PrismaService,
    ConfigService,
    UsersService,
    AuthService,
    JwtService,
  ],
})
export class MemberModule {}
