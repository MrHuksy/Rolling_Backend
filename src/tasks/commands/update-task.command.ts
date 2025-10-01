import { ICommand } from '@nestjs/cqrs';

export class UpdateTaskCommand implements ICommand {
  constructor(public readonly id: string, public readonly updates: any) {}
}
