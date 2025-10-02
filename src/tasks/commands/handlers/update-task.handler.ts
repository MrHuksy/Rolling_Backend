import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../update-task.command';
import { TasksService } from '../../services/tasks.service';
import { TaskResponse } from '../../types/task-response.type';


@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(command: UpdateTaskCommand): Promise<TaskResponse> {
    return this.tasksService.updateTask(command.id, command.updates);
  }
}
