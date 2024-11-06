import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(55)
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(55)
  lastName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(55)
  adresse: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(55)
  city: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(1000)
  @Max(100000)
  postaleCode: number;
  @IsEmail()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(55)
  email: string;
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
