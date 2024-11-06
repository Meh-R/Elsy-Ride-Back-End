import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class updateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  name: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  picsProduct: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(10000)
  description: string;
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  price: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock: number;
  @IsOptional()
  @IsString()
  categoryId: string;
}
