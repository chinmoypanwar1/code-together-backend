import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse } from 'cloudinary';
import * as fs from 'fs';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'image',
        folder: 'profile_pictures',
        quality: 'auto:good',
      });
      fs.unlinkSync(file.path);
      return result;
    } catch (error: unknown) {
      const cloudError = error as UploadApiErrorResponse;
      throw cloudError;
    }
  }

  async replaceFile(
    newFile: Express.Multer.File,
    oldPublicId: string,
  ): Promise<CloudinaryResponse> {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
      const result = await cloudinary.uploader.upload(newFile.path, {
        resource_type: 'image',
      });
      fs.unlinkSync(newFile.path);
      return result;
    } catch (error: unknown) {
      const cloudError = error as UploadApiErrorResponse;
      throw cloudError;
    }
  }
}
