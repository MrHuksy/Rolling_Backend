import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../delete-task.command';
import { TasksService } from '../../services/tasks.service';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(private readonly tasksService: TasksService) {}

  async execute(command: DeleteTaskCommand): Promise<{ message: string } | null> {
    return this.tasksService.deleteTask(command.id);
  }
}
