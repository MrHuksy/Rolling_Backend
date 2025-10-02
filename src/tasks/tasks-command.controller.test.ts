import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { TasksCommandController } from './tasks-command.controller';
import { TaskDto } from './dto/task.dto';
import { CreateTaskCommand } from './commands/create-task.command';
import { DeleteTaskCommand } from './commands/delete-task.command';
import { UpdateTaskCommand } from './commands/update-task.command';

const commandBusExecute = jest.fn();

class CommandBusMock {
  execute = commandBusExecute;
}

describe('TasksCommandController', () => {
  let controller: TasksCommandController;

  beforeEach(async () => {
    commandBusExecute.mockReset();
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksCommandController],
      providers: [{ provide: CommandBus, useClass: CommandBusMock }],
    }).compile();

    controller = moduleRef.get(TasksCommandController);
  });

  const validDto: TaskDto = {
    id: 'abc123',
    complete: false,
    created: '01/10/2025',
    description: 'Test task',
    due: '2025-10-15T00:00:00.000Z',
    title: 'My Task'
  };

  it('create task with valid dto', async () => {
    commandBusExecute.mockResolvedValueOnce({ ...validDto });
    const result = await controller.createTask(validDto);
    expect(result).toEqual(validDto);
    expect(commandBusExecute).toHaveBeenCalledWith(expect.any(CreateTaskCommand));
  });

  describe('validation', () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true });

    it('fail when id missing', async () => {
      const { id, ...rest } = validDto;
      await expect(pipe.transform(rest, { type: 'body', metatype: TaskDto } as any)).rejects.toMatchObject({
        response: expect.objectContaining({ message: expect.arrayContaining(['id is required']) })
      });
    });

    it('fail when complete is not a boolean', async () => {
      const { complete, ...rest } = validDto;
      await expect(pipe.transform(rest, { type: 'body', metatype: TaskDto } as any)).rejects.toMatchObject({
        response: expect.objectContaining({ message: expect.arrayContaining(['complete must be a boolean value']) })
      });
    });

    it('fail when created format pattern is invalid', async () => {
      const dto = { ...validDto, created: '2025-01-01' }; // wrong pattern
      await expect(pipe.transform(dto, { type: 'body', metatype: TaskDto } as any)).rejects.toMatchObject({
        response: expect.objectContaining({ message: expect.arrayContaining(['created must be a real calendar date in the format DD/MM/YYYY']) })
      });
    });

    it('fail when created is an impossible calendar date', async () => {
      const dto = { ...validDto, created: '33/12/2033' }; // passes regex, but invalid date
      await expect(pipe.transform(dto, { type: 'body', metatype: TaskDto } as any)).rejects.toMatchObject({
        response: expect.objectContaining({ message: expect.arrayContaining(['created must be a real calendar date in the format DD/MM/YYYY']) })
      });
    });

    it('fail when due is not a valid', async () => {
      const dto = { ...validDto, due: 12345 } as any;
      await expect(pipe.transform(dto, { type: 'body', metatype: TaskDto } as any)).rejects.toBeTruthy();
    });
  });

  it('delete task delegates to command bus', async () => {
    commandBusExecute.mockResolvedValueOnce({ message: 'ok' });
    const result = await controller.deleteTask('abc123');
    expect(result).toEqual({ message: 'ok' });
    expect(commandBusExecute).toHaveBeenCalledWith(expect.any(DeleteTaskCommand));
  });

  it('update task delegates to command bus', async () => {
    commandBusExecute.mockResolvedValueOnce({ ...validDto, title: 'Updated' });
    const result = await controller.updateTask(validDto.id, { ...validDto, title: 'Updated' });
    expect(result.title).toBe('Updated');
    expect(commandBusExecute).toHaveBeenCalledWith(expect.any(UpdateTaskCommand));
  });
});
