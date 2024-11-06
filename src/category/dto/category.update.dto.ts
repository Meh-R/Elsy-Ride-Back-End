import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class updateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(55)
  type: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  picsCategory: string;
}
