import { Request } from 'express';
import { EditorService } from './editor.service';
import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Req,
} from '@nestjs/common';

@Controller('editor')
export class EditorController {
  constructor(private readonly editorService: EditorService) { }

  @Get('/initialFileSystem/:projectId')
  async getInitialFileSystem(
    @Param('projectId') projectId: string,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new ForbiddenException('User not found');
    }
    const response = await this.editorService.getInitialFileSystem(
      projectId,
      user['user_id'],
    );
    return response;
  }
}
