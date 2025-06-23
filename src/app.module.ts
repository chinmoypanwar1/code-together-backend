import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { DockerodeModule } from './dockerode/dockerode.module';
import { ProjectModule } from './project/project.module';
import { TodosModule } from './todos/todos.module';
import { ImageModule } from './image/image.module';
import { EditorModule } from './editor/editor.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,
    DockerodeModule,
    ProjectModule,
    TodosModule,
    ImageModule,
    EditorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
