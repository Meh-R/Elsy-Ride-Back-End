import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  signUp(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Get('/validAccount/:token')
  @Redirect('http://localhost:3000/login')
  validAccount(@Param('token') token: string) {
    return this.authService.validAccount(token);
  }

  @Post('/signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }
}
