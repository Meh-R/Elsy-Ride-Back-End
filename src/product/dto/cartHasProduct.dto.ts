import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class cartHasProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
