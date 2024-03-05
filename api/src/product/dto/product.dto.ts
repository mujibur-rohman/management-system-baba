import { Cart } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty({ message: 'ProductId is required.' })
  productId: number;

  @IsNotEmpty({ message: 'Price is required.' })
  price: string;

  @IsNotEmpty({ message: 'Quantity is required.' })
  qty: number;
}

export class EditCartDto {
  @IsNotEmpty({ message: 'Price is required.' })
  price: string;

  @IsNotEmpty({ message: 'Quantity is required.' })
  qty: number;
}

export class ArrEditCartDto {
  @IsNotEmpty({ message: 'Data is required.' })
  data: Cart[];
}

export class ConfirmSwitchProductDto {
  @IsOptional()
  memberId: number;

  @IsNotEmpty({ message: 'Old Code Product is required.' })
  oldCodeProduct: string;

  @IsNotEmpty({ message: 'New Code Product is required.' })
  newCodeProduct: string;

  @IsNotEmpty({ message: 'Quantity is required.' })
  qty: number;
}

export class AddSwitchProductDto {
  @IsNotEmpty({ message: 'Old Code Product is required.' })
  oldCodeProduct: string;

  @IsNotEmpty({ message: 'New Code Product is required.' })
  newCodeProduct: string;

  @IsNotEmpty({ message: 'Quantity Product is required.' })
  qty: number;
}
