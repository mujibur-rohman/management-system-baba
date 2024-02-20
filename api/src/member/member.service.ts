import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import STATUS_MEMBER from 'src/types/status-member';
import { User } from 'src/users/types/user.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MemberService {
  totalMemberGlobal = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  getStatusMemberBellow(status: string) {
    const myStatus = STATUS_MEMBER.find((s) => s.name === status);
    const bellowStatus = STATUS_MEMBER.find((s) => s.id === myStatus.id + 1);
    return bellowStatus;
  }

  async registerMember(registerDto: RegisterDto, userData: User) {
    const { user } = await this.authService.register({
      name: registerDto.name,
      password: registerDto.password,
      idMember: registerDto.idMember,
      email: null,
      parentId: userData.id || null,
      role: registerDto.role
        ? registerDto.role
        : this.getStatusMemberBellow(userData.role).name,
      joinDate: new Date(),
    });
    return {
      data: user,
      message: 'Member berhasil didaftarkan',
    };
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
        select: {
          id: true,
          avatar: true,
          idMember: true,
          name: true,
          parentId: true,
          joinDate: true,
          role: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return {
        page,
        limit,
        totalRows,
        totalPage,
        data: members,
      };
    } else if (type === 'hierarchy') {
      const topLevelMembers = await this.fetchNestedMembers(userData.user.id);
      return {
        page: 0,
        limit: 0,
        totalRows: topLevelMembers.length,
        totalPage: 0,
        data: topLevelMembers,
        haha: this.totalMemberGlobal,
      };
    } else {
      throw new BadRequestException('type must be hierarchy or table');
    }
  }

  async fetchNestedMembers(id: any) {
    const members = await this.prisma.user.findMany({
      where: {
        parentId: id,
      },
      select: {
        id: true,
        avatar: true,
        idMember: true,
        name: true,
        parentId: true,
        joinDate: true,
        role: true,
      },
    });

    if (members.length === 0) {
      return [];
    }

    const nestedMembersPromises = members.map(async (member) => {
      this.totalMemberGlobal = this.totalMemberGlobal + 1;
      const children = await this.fetchNestedMembers(member.id);
      const tempData: any = {
        ...member,
      };
      if (children.length > 0) {
        tempData.children = children;
      }
      return tempData;
    });

    return Promise.all(nestedMembersPromises);
  }

  async resetPassword({ id, password }: { id: string; password: string }) {
    if (!id || !password) {
      throw new BadRequestException('id or password is required');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedNewPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return { message: `Password berhasil direset` };
  }

  async deleteMember(id: string) {
    if (!id) {
      throw new BadRequestException('id is required');
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return { message: `Member berhasil dihapus` };
  }
}
