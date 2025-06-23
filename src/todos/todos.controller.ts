import { Controller, ForbiddenException, Patch, Post, Put } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Request } from 'express';
import { ToggleTodoDto } from './dto/toggle-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) { }

  @Post('/createTodos')
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req: Request) {
    const user = req.user;
    if (!user || !user['user_id']) {
      throw new ForbiddenException('User not found');
    }
    const response = await this.todosService.createProjectTodo(
      createTodoDto,
      user['user_id'],
    );
    return response;
  }

  @Patch('/toggleTodo')
  async toggleTodo(@Body() toggleTodoDto: ToggleTodoDto) {
    const response = await this.todosService.toggleTodo(toggleTodoDto);
    return response;
  }
}
