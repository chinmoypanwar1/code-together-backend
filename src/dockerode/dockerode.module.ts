import { Module } from '@nestjs/common';
import { DockerodeService } from './dockerode.service';

@Module({
  providers: [DockerodeService],
  exports: [DockerodeService],
})
export class DockerodeModule {}
