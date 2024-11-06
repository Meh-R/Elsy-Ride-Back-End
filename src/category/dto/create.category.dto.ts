import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(55)
  type: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  picsCategory: string;
}
