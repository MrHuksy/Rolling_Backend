import 'reflect-metadata';
import { Controller, Post, Delete, Patch, Param, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTaskCommand } from './commands/create-task.command';
import { DeleteTaskCommand } from './commands/delete-task.command';
import { UpdateTaskCommand } from './commands/update-task.command';

@Controller('tasks')
export class TasksCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createTask(@Body() task: any): Promise<any> {
    return this.commandBus.execute(new CreateTaskCommand(task));
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string } | null> {
    return this.commandBus.execute(new DeleteTaskCommand(id));
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() updates: any): Promise<any> {
    return this.commandBus.execute(new UpdateTaskCommand(id, updates));
  }
}
