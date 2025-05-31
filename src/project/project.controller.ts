import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { Request } from 'express';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Get('/getAllProjectDetails')
  async getProject(@Req() req: Request) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.projectService.getProjectDetails(
      user['user_id'],
    );
    return response;
  }

  @Post('/createProject')
  async createProject(
    @Req() req: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.projectService.createProject(
      user['user_id'],
      createProjectDto,
    );
    return response;
  }

  @Delete('/deleteProject/:project_id')
  async deleteProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
  ) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.projectService.deleteProject(
      user['user_id'],
      project_id,
    );
    return response;
  }

  @Post('/startProject/:project_id')
  async startProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
  ) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.projectService.startProject(
      user['user_id'],
      project_id,
    );
    return response;
  }

  @Post('/stopProject/:project_id')
  async stopProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
  ) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new Error('User not found');
    }
    const response = await this.projectService.stopProject(
      user['user_id'],
      project_id,
    );
    return response;
  }
}
