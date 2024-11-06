import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status: string;
}
