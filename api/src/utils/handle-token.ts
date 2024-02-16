import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

export class JWTToken {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  public async getToken(user: User) {
    let parent;
    if (user.parentId) {
      parent = await this.prisma.user.findUnique({
        where: {
          id: user.parentId,
        },
        select: {
          name: true,
          id: true,
          idMember: true,
        },
      });
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          ...user,
          parent,
        },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '20s',
        },
      ),
      this.jwt.signAsync(
        {
          ...user,
          parent,
        },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);
    return {
      user: {
        ...user,
        parent,
      },
      accessToken,
      refreshToken,
    };
  }

  public async getRefreshToken(token: string) {
    const decoded = await this.jwt.decode(token);
    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new ForbiddenException('Invalid token!');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
      include: {
        avatar: true,
      },
    });

    const data = await this.getToken(user);

    return { ...data };
  }
}
