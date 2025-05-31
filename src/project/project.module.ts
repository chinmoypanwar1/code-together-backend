import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DockerodeModule } from 'src/dockerode/dockerode.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [DockerodeModule, PrismaModule],
})
export class ProjectModule {}
