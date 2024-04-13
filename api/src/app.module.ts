import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MemberService } from './member/member.service';
import { MemberModule } from './member/member.module';
import { MemberController } from './member/member.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsersModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MemberModule,
    ProductModule,
    OrderModule,
    DashboardModule,
    TodoModule,
  ],
  controllers: [AppController, MemberController],
  providers: [
    AppService,
    EmailService,
    MemberService,
    PrismaService,
    AuthService,
    JwtService,
  ],
})
export class AppModule {}
