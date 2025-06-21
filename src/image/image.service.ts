import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllImages() {
    const images = await this.prisma.dockerImage.findMany();
    const response = {
      data: images,
      message: 'All Images Data Fetched Successfully',
      success: 'Success',
    };

    return response;
  }
}
