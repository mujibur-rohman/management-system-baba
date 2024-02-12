import { IsNotEmpty } from 'class-validator';

export class ChangeNameDto {
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;
}
export class AvatarDto {
  @IsNotEmpty({ message: 'User Id is required' })
  userId: number;
}

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'New Password is required.' })
  newPassword: string;

  @IsNotEmpty({ message: 'Old Password is required.' })
  oldPassword: string;
}
