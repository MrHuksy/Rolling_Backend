import 'reflect-metadata';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetTaskByIdQuery } from './queries/get-task-by-id.query';
import { GetAllTasksQuery } from './queries/get-all-tasks.query';

@Controller('tasks')
export class TasksQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllTasks(): Promise<any[]> {
    return this.queryBus.execute(new GetAllTasksQuery());
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<any> {
    return this.queryBus.execute(new GetTaskByIdQuery(id));
  }
}
