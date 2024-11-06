import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SigninDto {
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
