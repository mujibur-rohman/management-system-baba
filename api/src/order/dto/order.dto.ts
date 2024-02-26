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
