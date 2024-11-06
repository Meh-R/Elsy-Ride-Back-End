import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService,
  ) {}

  async signup(dto: SignupDto) {
    const exisingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (exisingUser) {
      throw new ForbiddenException('Email already taken');
    }

    const hash = await argon.hash(dto.password);
    const activationToken = await argon.hash(`${new Date()} + ${dto.email}`);
    const cleanToken = activationToken.replace('/', '');
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        adresse: dto.adresse,
        city: dto.city,
        postaleCode: dto.postaleCode,
        email: dto.email,
        password: hash,
        role: 'user',
        isActive: 0,
        token: cleanToken,
      },
    });

    await this.emailService.sendUserConfirmation(user);
    return this.signToken(user.id);
  }

  async validAccount(token: string) {
    const exisingUser = await this.prisma.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!exisingUser) {
      throw new ForbiddenException('Account not valid');
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: exisingUser.id,
      },
      data: {
        token: '',
        isActive: 1,
      },
    });

    const cart = await this.prisma.cart.create({
      data: {
        userId: exisingUser.id,
      },
    });
    return 'truc';
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid crendentials');
    }
    if (user.isActive != 1) {
      throw new ForbiddenException(' user not activate');
    }

    const isValidPassword = await argon.verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new ForbiddenException('Invalid crendentials');
    }
    return { token: await this.signToken(user.id), role: user.role };
  }

  async signToken(userId: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
