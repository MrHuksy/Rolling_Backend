import 'reflect-metadata';
import { Controller, Get, Post, Delete, Patch, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(): Promise<any[]> {
    const tasks = await this.tasksService.getAllTasks();
    return Array.isArray(tasks) ? tasks : [];
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<any> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() task: any): Promise<any> {
    return this.tasksService.createTask(task);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string } | null> {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() updates: any): Promise<any> {
    return this.tasksService.updateTask(id, updates);
  }
}
