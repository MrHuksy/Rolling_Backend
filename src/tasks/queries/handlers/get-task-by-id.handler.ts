import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetTaskByIdQuery } from '../get-task-by-id.query';
import { TasksService } from '../../services/tasks.service';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler implements IQueryHandler<GetTaskByIdQuery> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(query: GetTaskByIdQuery): Promise<any> {
    return this.tasksService.getTaskById(query.id);
  }
}
