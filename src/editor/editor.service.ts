import { Injectable, NotFoundException } from '@nestjs/common';
import { DockerodeService } from 'src/dockerode/dockerode.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import path from 'path';

@Injectable()
export class EditorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly docker: DockerodeService,
  ) { }

  async getInitialFileSystem(projectId: string, userId: string) {
    // Check if a project exists with the following projectId or not
    const containerId = await this.prisma.project.findUnique({
      where: {
        project_id: projectId,
      },
      select: {
        container_id: true,
      },
    });
    if (!containerId) {
      throw new NotFoundException(
        'Cannot find the project with the given project id',
      );
    }
    // Get the filesystem from the volumes
    const hostPath = path.join(
      '/code-together',
      'user-data',
      `user_${userId}`,
      `project_${projectId}`,
    );

    const getFileSystem = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const files: Record<string, string> = {};

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          Object.assign(files, getFileSystem(fullPath));
        } else {
          files[path.relative(hostPath, fullPath)] = fs.readFileSync(
            fullPath,
            'utf-8',
          );
        }
      }

      return files;
    };

    const fileSystem = getFileSystem(hostPath);
    const response = {
      data: fileSystem,
      message: 'Initial File System fetched successfully',
      success: 'Success',
    };
    return response;
  }
}
