import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TasksQueryController } from './tasks-query.controller';
import { TasksCommandController } from './tasks-command.controller';

import { GetAllTasksHandler } from './queries/handlers/get-all-tasks.handler';
import { GetTaskByIdHandler } from './queries/handlers/get-task-by-id.handler';
import { CreateTaskHandler } from './commands/handlers/create-task.handler';
import { DeleteTaskHandler } from './commands/handlers/delete-task.handler';
import { UpdateTaskHandler } from './commands/handlers/update-task.handler';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [CqrsModule],
  controllers: [TasksQueryController, TasksCommandController],
  providers: [
    TasksService,
    GetAllTasksHandler,
    GetTaskByIdHandler,
    CreateTaskHandler,
    DeleteTaskHandler,
    UpdateTaskHandler,
  ],
})
export class TasksModule {}
