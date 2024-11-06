import {
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class userUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(55)
  firstName: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(55)
  lastName: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(55)
  adresse: string;
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(55)
  city: string;
  @IsOptional()
  @IsNumber()
  @Min(10000)
  @Max(100000)
  postaleCode: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  isActive: number;
}
