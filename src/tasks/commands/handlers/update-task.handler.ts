import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../update-task.command';
import { TasksService } from '../../services/tasks.service';


@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(command: UpdateTaskCommand): Promise<any> {
    return this.tasksService.updateTask(command.id, command.updates);
  }
}
