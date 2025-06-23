import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoStates } from '@prisma/client';
import { ToggleTodoDto } from './dto/toggle-todo.dto';

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
      success: 'Success',
    };
    return response;
  }

  async createProjectTodo(createTodoDto: CreateTodoDto, userId: string) {
    const { projectId, title, content } = createTodoDto;
    const projectExists = await this.prisma.project.findUnique({
      where: {
        project_id: projectId,
      },
    });
    if (!projectExists) {
      throw new NotFoundException(
        'The project with the given project id could not be found',
      );
    }
    const todo = await this.prisma.projectTodo.create({
      data: {
        content: content,
        title: title,
        project_id: projectId,
        creator_id: userId,
        status: 'Pending',
      },
    });
    const response = {
      data: todo,
      message: 'Todo created successfully',
      success: 'Success',
    };
    return response;
  }

  async toggleTodo(toggleTodoDto: ToggleTodoDto) {
    const { todoId } = toggleTodoDto;
    const todo = await this.prisma.projectTodo.findUnique({
      where: {
        todo_id: todoId,
      },
    });
    if (!todo) {
      throw new NotFoundException('Todo not found with the following todo');
    }
    const newStatus = todo.status === 'Pending' ? 'Done' : 'Pending';
    const updatedTodo = await this.prisma.projectTodo.update({
      where: {
        todo_id: todoId,
      },
      data: {
        status: newStatus,
      },
    });
    const response = {
      data: updatedTodo,
      message: 'Todo updated successfully',
      success: 'Success',
    };
    return response;
  }
}
