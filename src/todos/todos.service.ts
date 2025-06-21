import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllProjectTodos(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        owner_id: userId,
      },
      select: {
        project_id: true,
        project_todos: {
          select: {
            todo_id: true,
            title: true,
            content: true,
            status: true,
          },
        },
      },
    });
    const response = {
      data: projects,
      message: 'All project todos fetched successfully',
      success: 'Success'
    }
    return response;
  }
}
