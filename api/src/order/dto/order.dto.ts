import { Cart } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Total price is required.' })
  totalPrice: string;

  @IsNotEmpty({ message: 'Amount transfer is required.' })
  amountTrf: string;

  @IsNotEmpty({ message: 'Amount cash is required.' })
  amountCash: string;

  @IsNotEmpty({ message: 'Remaining amount is required.' })
  remainingAmount: string;

  @IsNotEmpty({ message: 'Cart is required.' })
  carts: object;
}

export class EditOrderDto {
  @IsNotEmpty({ message: 'Total price is required.' })
  totalPrice: string;

  @IsNotEmpty({ message: 'Remaining amount is required.' })
  remainingAmount: string;

  @IsNotEmpty({ message: 'Cart is required.' })
  cart: object;
}

export class AmountOrderDto {
  @IsNotEmpty({ message: 'Amount cash is required.' })
  amountCash: string;

  @IsNotEmpty({ message: 'Amount transfer is required.' })
  amountTrf: string;

  @IsNotEmpty({ message: 'Remaining amount is required.' })
  remainingAmount: string;
}

export class ConfirmOrderDto {
  @IsNotEmpty({ message: 'Cart is required.' })
  cart: Cart[];

  @IsOptional()
  memberUserId: number;
}

export class AddClosingDto {
  @IsNotEmpty({ message: 'Customer name is required.' })
  customerName: string;

  @IsNotEmpty({ message: 'Total price is required.' })
  totalPrice: string;

  @IsNotEmpty({ message: 'Quantity is required.' })
  qty: number;

  @IsNotEmpty({ message: 'Product Id is required.' })
  productId: number;
}
