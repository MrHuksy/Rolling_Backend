import { ICommand } from '@nestjs/cqrs';
import { TaskDto } from '../dto/task.dto';

export class CreateTaskCommand implements ICommand {
  constructor(public readonly task: TaskDto) {}
}
