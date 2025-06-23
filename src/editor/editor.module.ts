import { Module } from '@nestjs/common';
import { EditorService } from './editor.service';
import { EditorController } from './editor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DockerodeModule } from 'src/dockerode/dockerode.module';

@Module({
  controllers: [EditorController],
  providers: [EditorService],
  imports: [PrismaModule, DockerodeModule],
})
export class EditorModule {}
