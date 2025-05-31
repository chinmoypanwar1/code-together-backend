import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  getOptimizedUrl(url: string) {
    return url.replace('/upload', '/upload/f_auto/q_auto');
  }

  getPublicIdFromUrl = (url: string) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  };

  async uploadProfilePicture(
    profilePicture: Express.Multer.File,
    userId: string,
  ): Promise<{ data: string; message: string; success: string }> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!userExists) {
      throw new ForbiddenException(
        'You have not registered. Please register first.',
      );
    }

    const profilePictureUrl = userExists.profile_picture_url;
    if (!profilePictureUrl) {
      try {
        const result = await this.cloudinaryService.uploadFile(profilePicture);
        await this.prisma.user.update({
          where: {
            user_id: userId,
          },
          data: {
            profile_picture_url: result.url,
          },
        });
        const response = {
          data: result.url,
          message: 'Image have been uploaded successfully',
          success: 'Success',
        };
        return response;
      } catch (error) {
        throw new InternalServerErrorException(
          'Internal Server Error from users.service.ts.',
        );
      }
    }

    const publicId = this.getPublicIdFromUrl(profilePictureUrl);

    try {
      const result = await this.cloudinaryService.replaceFile(
        profilePicture,
        publicId,
      );
      await this.prisma.user.update({
        where: {
          user_id: userId,
        },
        data: {
          profile_picture_url: result.url,
        },
      });
      const response = {
        data: result.url,
        message: 'Image have been uploaded successfully',
        success: 'Success',
      };
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Internal Server Error while replacing the image in user.service.ts',
      );
    }
  }

  async getUserDetails(userId: string) {
    // Get all the details of the user and return back to the client
    // Check if user exists with the following email or not
    const userExists = await this.prisma.user.findUnique({
      where: {
        user_id: userId,
      },
    });
    if (!userExists) {
      throw new ForbiddenException('Please register yourself first.');
    }
    if (
      userExists.profile_picture_url !== null &&
      userExists.profile_picture_url?.trim() !== ''
    ) {
      const imageUrl = userExists.profile_picture_url;
      const optimizedUrl = this.getOptimizedUrl(imageUrl);
      userExists.profile_picture_url = optimizedUrl;
    }
    const response = {
      data: userExists,
      message: 'User Data fetched successfully',
      success: 'Success',
    };
    return response;
  }
}
