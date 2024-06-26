import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AvatarDto, ChangeNameDto, ChangePasswordDto } from './dto/users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveAvatarToStorage } from 'src/utils/storage-files';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { SupplierGuard } from 'src/guards/supplier.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(SupplierGuard)
  @UseGuards(AccessTokenGuard)
  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Put('/change-password/:id')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Param('id') id: string,
  ) {
    const result = await this.userService.changePassword({
      changePasswordDto,
      id,
    });
    return result;
  }

  @Put('/change-name/:id')
  async changeName(
    @Body() changeNameDto: ChangeNameDto,
    @Param('id') id: string,
  ) {
    const result = await this.userService.changeName({
      changeNameDto,
      id,
    });
    return result;
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar', saveAvatarToStorage))
  @UseGuards(AccessTokenGuard)
  async uploadAvatar(
    @UploadedFile()
    avatar: Express.Multer.File,
    @Body() avatarDto: AvatarDto,
  ) {
    if (!avatar) {
      throw new BadRequestException('avatar is required');
    }

    return await this.userService.uploadAvatar(
      avatar,
      avatarDto,
      'https://fuzenkbabaparfume.com/hapi',
    );
  }
}
