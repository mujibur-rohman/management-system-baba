import { IsIn, IsNotEmpty } from 'class-validator';

export class GetDataMemberDto {
  @IsNotEmpty({ message: 'Type is required.' })
  @IsIn(['hierarchy', 'table'])
  type: string;
}
