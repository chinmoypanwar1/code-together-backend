import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/multer.config';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('/uploadProfilePicture')
  @UseInterceptors(FileInterceptor('profile_picture', multerOptions))
  async uploadFile(
    @UploadedFile() profile_picture: Express.Multer.File,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.userService.uploadProfilePicture(
      profile_picture,
      user['user_id'],
    );
    return response;
  }

  @Get('/userDetails')
  async getUserDetails(@Req() req: Request) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.userService.getUserDetails(user['user_id']);
    return response;
  }
}
