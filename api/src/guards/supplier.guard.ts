import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import STATUS_MEMBER from 'src/types/status-member';

@Injectable()
export class SupplierGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = request.headers.authorization
      .replace('Bearer', '')
      .trim();
    const decoded = await this.jwt.decode(token);
    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new ForbiddenException('Invalid tokennn!');
    }
    const user: User = decoded.user;
    return user.role === STATUS_MEMBER[0].name;
  }
}
