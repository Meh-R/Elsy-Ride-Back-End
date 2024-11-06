import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  cartId: string;
  @IsString()
  @IsNotEmpty()
  cartHasProductId: string;

  @IsInt()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsNotEmpty()
  status: string;
}
