import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import ROLES from '../types/role';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required.' })
  @IsString({ message: 'Name must need to be one string.' })
  name: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 8 characters.' })
  password: string;

  @IsEmail({}, { message: 'Email is invalid.' })
  @IsOptional()
  email: string;

  @IsNotEmpty({ message: 'Id Member is required.' })
  idMember: string;

  @IsOptional()
  parentId: number;

  @IsOptional()
  @IsIn(Object.values(ROLES))
  role: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Id Member is required.' })
  idMember: string;

  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

export class LogoutDto {
  @IsNotEmpty({ message: 'User Id is required.' })
  userId: number;
}

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'Token is required.' })
  token: string;

  @IsNotEmpty({ message: 'User Id is required.' })
  userId: number;
}

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;

  @IsNotEmpty({ message: 'Token is required.' })
  activationToken: string;
}
