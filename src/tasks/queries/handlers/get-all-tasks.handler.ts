import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllTasksQuery } from '../get-all-tasks.query';
import { TasksService } from '../../services/tasks.service';
import { TaskResponse } from '../../types/task-response.type';

@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler implements IQueryHandler<GetAllTasksQuery> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(): Promise<TaskResponse[]> {
    const tasks = await this.tasksService.getAllTasks();
    return Array.isArray(tasks) ? tasks.map(task => ({
      id: task.id,
      complete: task.complete,
      created: task.created,
      description: task.description,
      due: task.due,
      title: task.title,
    })) : [];
  }
}
