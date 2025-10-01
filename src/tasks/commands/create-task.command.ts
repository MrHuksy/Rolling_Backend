import { ICommand } from '@nestjs/cqrs';

export class CreateTaskCommand implements ICommand {
  constructor(public readonly task: any) {}
}
