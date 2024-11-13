import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/Guards';
import { User } from '@prisma/client';
import { userUpdateDto } from './dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/details')
  async getUser(@GetUser() user: User) {
    return this.userService.getUser(user);
  }

  @Get('/all')
  getAllUser(@GetUser() user: User) {
    return this.userService.getAllUser(user);
  }

  @Get('/find/:query')
  findUser(@GetUser() user: User, @Param('query') query: string) {
    return this.userService.findUser(user, query);
  }

  @Patch('/update/:id')
  updateUser(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: userUpdateDto,
  ) {
    return this.userService.updateUser(user, id, dto);
  }

  @Patch('/update/:id')
  updateMyProfile(@GetUser() user: User, @Body() dto: userUpdateDto) {
    return this.userService.updateMyProfile(user, dto);
  }

  @Delete('/delete/:id')
  deleteUser(@GetUser() user: User, @Param('id') id: string) {
    return this.userService.deleteUser(user, id);
  }

  @Delete('/delete')
  deleteMyProfile(@GetUser() user: User) {
    return this.userService.deleteMyProfile(user);
  }
}
