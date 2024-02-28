import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { Request } from 'express';
import { RegisterDto } from 'src/auth/dto/auth.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getMyMember(
    @Req() request: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('q') q: string = '',
    @Query('type') type: string = 'table',
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    return await this.memberService.getMyMember({
      limit: limit * 1,
      page: page * 1,
      q,
      userData: request as any,
      type: type as 'hierarchy' | 'table',
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/register')
  async registerMember(
    @Body() registerDto: RegisterDto,
    @Req() request: Request,
  ) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const result = this.memberService.registerMember(
      registerDto,
      request.user as any,
    );

    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteMember(@Param('id') id: string) {
    const result = this.memberService.deleteMember(id);
    return result;
  }

  @Get('/:id')
  async getMemberById(@Param('id') id: string) {
    const result = this.memberService.getMemberById(parseInt(id));
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { password: string },
  ) {
    const result = this.memberService.resetPassword({
      id,
      password: body.password,
    });
    return result;
  }
}
