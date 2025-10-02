import { ICommand } from '@nestjs/cqrs';
import { TaskDto } from '../dto/task.dto';

export class UpdateTaskCommand implements ICommand {
  constructor(public readonly id: string, public readonly updates: Partial<TaskDto>) {}
}
