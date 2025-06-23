import { IsString } from 'class-validator';

export class ToggleTodoDto {
  @IsString()
  todoId: string;
}
