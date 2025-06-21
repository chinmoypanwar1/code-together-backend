import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @Get('/getAllImageDetails')
  async getAllImageDetails() {
    const response = await this.imageService.getAllImages();
    return response;
  }
}
