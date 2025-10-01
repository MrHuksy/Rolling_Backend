import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllTasksQuery } from '../get-all-tasks.query';
import { TasksService } from '../../services/tasks.service';

@QueryHandler(GetAllTasksQuery)
export class GetAllTasksHandler implements IQueryHandler<GetAllTasksQuery> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(): Promise<any[]> {
    const tasks = await this.tasksService.getAllTasks();
    return Array.isArray(tasks) ? tasks : [];
  }
}
