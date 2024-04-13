import { IsNotEmpty } from 'class-validator';

export class AddTodo {
  @IsNotEmpty({ message: 'Name is required.' })
  name: number;

  @IsNotEmpty({ message: 'Date is required.' })
  targetDate: Date;

  @IsNotEmpty({ message: 'Quantity is required.' })
  qty: number;
}
