import { Cart } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Total price is required.' })
  totalPrice: string;

  @IsNotEmpty({ message: 'Amount transfer is required.' })
  amountTrf: string;

  @IsNotEmpty({ message: 'Amount cash is required.' })
  amountCash: string;

  @IsNotEmpty({ message: 'Remaining amount is required.' })
  remainingAmount: string;
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
}
