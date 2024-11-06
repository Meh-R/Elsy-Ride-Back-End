import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class creatProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  name: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  picsProduct: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(10000)
  description: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
