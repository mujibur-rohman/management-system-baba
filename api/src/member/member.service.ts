import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import ROLES from 'src/auth/types/role';
import { User } from 'src/users/types/user.type';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async registerMember(registerDto: RegisterDto, userData: { user: User }) {
    const { user } = await this.authService.register({
      name: registerDto.name,
      password: registerDto.password,
      idMember: registerDto.idMember,
      email: null,
      parentId: userData.user?.id || null,
      role: ROLES.RESELLER,
    });
    return user;
  }

  async getMyMember({
    limit,
    page,
    q,
    userData,
    type = 'table',
  }: {
    q: string;
    page: number;
    limit: number;
    userData: { user: User };
    type?: 'hierarchy' | 'table';
  }) {
    if (type === 'table') {
      const offset = limit * page - limit;

      const totalRows = await this.prisma.user.count({
        where: {
          parentId: userData.user.id,
          name: {
            contains: q,
          },
        },
      });

      const totalPage = Math.ceil(totalRows / limit);

      const members = await this.prisma.user.findMany({
        where: {
          parentId: userData.user.id,
          name: {
            contains: q,
          },
        },
        skip: offset,
        take: limit,
      });

      return {
        page,
        limit,
        totalRows,
        totalPage,
        data: members,
      };
    } else if (type === 'hierarchy') {
      return {
        hehe: 'hi',
      };
    } else {
      throw new BadRequestException('type must be hierarchy or table');
    }
  }
}
