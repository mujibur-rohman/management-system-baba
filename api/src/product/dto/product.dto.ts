import { Cart } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

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
