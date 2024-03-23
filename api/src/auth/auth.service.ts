import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { comparePassword } from 'src/utils/compare-password';
import { JWTToken } from 'src/utils/handle-token';
import { User } from '@prisma/client';
import { EmailService } from 'src/email/email.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import STATUS_MEMBER from 'src/types/status-member';
import PRODUCT_DATA from 'src/config/product-setting';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  async register(registerDto: RegisterDto) {
    const {
      name,
      password,
      idMember,
      parentId,
      joinDate,
      role,
      leaderSignedId,
    } = registerDto;

    const isIdExist = await this.prisma.user.findUnique({
      where: {
        idMember,
      },
    });

    if (isIdExist) {
      throw new BadRequestException('Id Member already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        idMember,
        role: role ? role : STATUS_MEMBER[0].name,
        parentId,
        joinDate: new Date(joinDate),
        leaderSignedId,
      },
      select: {
        id: true,
        name: true,
        idMember: true,
      },
    });

    const mappingGenerate = PRODUCT_DATA.map(async (product) => {
      await this.prisma.product.create({
        data: {
          userId: user.id,
          aromaLama: product[0],
          aromaBaru: product[1],
          codeProduct: product[2],
          stock: 0,
        },
      });
    });

    await Promise.all(mappingGenerate);

    return { user, message: 'Account has registered' };
  }

  // * Login

  async login(loginDto: LoginDto) {
    const { idMember, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        idMember,
      },
      include: {
        avatar: true,
      },
    });
    if (user && (await comparePassword(password, user.password))) {
      const token = new JWTToken(
        this.configService,
        this.jwtService,
        this.prisma,
      );
      await this.updateRefreshToken(
        user.id,
        (await token.getToken(user)).refreshToken,
      );
      return await token.getToken(user);
    } else {
      throw new BadRequestException('id member atau password salah');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { token, userId } = refreshTokenDto;
    const tokenInstance = new JWTToken(
      this.configService,
      this.jwtService,
      this.prisma,
    );

    const newRefreshToken = (await tokenInstance.getRefreshToken(token))
      .refreshToken;
    await this.updateRefreshToken(userId, newRefreshToken);
    return {
      ...(await tokenInstance.getRefreshToken(token)),
      message: 'Success refresh token',
    };
  }

  // * Logout
  async logout(userId: number) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        token: null,
      },
    });
  }

  // * Update token from db
  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        token: hashedRefreshToken,
      },
    });
  }

  //* forgot password
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password!',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return {
      message: `Check your email to forgot password!`,
      activationToken: forgotPasswordToken,
    };
  }

  //* generate forgot password link
  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  //* reset password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);

    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        name: true,
        email: true,
      },
    });

    return { user, message: 'Reset Password successfully' };
  }
}
