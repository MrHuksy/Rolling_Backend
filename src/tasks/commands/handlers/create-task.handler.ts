import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../create-task.command';
import { TasksService } from '../../services/tasks.service';
import { TaskResponse } from '../../types/task-response.type';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(command: CreateTaskCommand): Promise<TaskResponse> {
    return this.tasksService.createTask(command.task);
  }
}
