import 'reflect-metadata';
import { Controller, Post, Delete, Patch, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from './commands/create-task.command';
import { DeleteTaskCommand } from './commands/delete-task.command';
import { UpdateTaskCommand } from './commands/update-task.command';
import { TaskDto } from './dto/task.dto';
import { TaskResponse } from './types/task-response.type';

@Controller('tasks')
@UsePipes(new ValidationPipe())
export class TasksCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createTask(@Body() task: TaskDto): Promise<TaskResponse> {
    return this.commandBus.execute(new CreateTaskCommand(task));
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string } | null> {
    return this.commandBus.execute(new DeleteTaskCommand(id));
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() updates: TaskDto): Promise<TaskResponse> {
    return this.commandBus.execute(new UpdateTaskCommand(id, updates));
  }
}
