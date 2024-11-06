import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class updatCartHasProductDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity: number;
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
