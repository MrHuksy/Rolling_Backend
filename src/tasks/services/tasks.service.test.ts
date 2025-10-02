import { HttpException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GetCommand, PutCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({})),
}));

const sendMock = jest.fn();

jest.mock('@aws-sdk/lib-dynamodb', () => {
  const original = jest.requireActual('@aws-sdk/lib-dynamodb');
  return {
    ...original,
    DynamoDBDocumentClient: { from: jest.fn(() => ({ send: sendMock })) },
    GetCommand: jest.fn().mockImplementation((input) => ({ __type: 'GetCommand', input })),
    PutCommand: jest.fn().mockImplementation((input) => ({ __type: 'PutCommand', input })),
    DeleteCommand: jest.fn().mockImplementation((input) => ({ __type: 'DeleteCommand', input })),
    ScanCommand: jest.fn().mockImplementation((input) => ({ __type: 'ScanCommand', input })),
  };
});

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService();
  });

  describe('getAllTasks', () => {
    it('return items array', async () => {
      const items = [{ id: '1', name: 'Task 1' }];
      sendMock.mockResolvedValueOnce({ Items: items });
      const result = await service.getAllTasks();
      expect(result).toEqual(items);
      expect(ScanCommand).toHaveBeenCalledWith({ TableName: 'TasksTable' });
    });

    it('return empty array if no items', async () => {
      sendMock.mockResolvedValueOnce({});
      const result = await service.getAllTasks();
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('return item if found', async () => {
      const item = { id: '123', name: 'Test' };
      sendMock.mockResolvedValueOnce({ Item: item });
      const result = await service.getTaskById('123');
      expect(result).toEqual(item);
      expect(GetCommand).toHaveBeenCalledWith({ TableName: 'TasksTable', Key: { id: '123' } });
    });

    it('return null if not found', async () => {
      sendMock.mockResolvedValueOnce({});
      const result = await service.getTaskById('missing');
      expect(result).toBeUndefined;
    });
  });

  describe('createTask', () => {
    it('create new task when not existing', async () => {
      sendMock.mockResolvedValueOnce({});
      const task = { id: '1', name: 'New Task' } as any;
      const result = await service.createTask(task);
      expect(result).toEqual(task);
      expect(GetCommand).toHaveBeenCalled();
      expect(PutCommand).toHaveBeenCalledWith({ TableName: 'TasksTable', Item: task });
    });

    it('throw confict if task exists', async () => {
      sendMock.mockResolvedValueOnce({ Item: { id: '1', name: 'Existing' } });
      await expect(service.createTask({ id: '1', name: 'X' } as any)).rejects.toThrow(HttpException);
      expect(PutCommand).not.toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('delete when exists', async () => {
      sendMock.mockResolvedValueOnce({ Item: { id: '1' } });
      sendMock.mockResolvedValueOnce({});
      const result = await service.deleteTask('1');
      expect(result).toEqual({ message: 'Task deleted successfully' });
      expect(DeleteCommand).toHaveBeenCalledWith({ TableName: 'TasksTable', Key: { id: '1' } });
    });

    it('throw not found', async () => {
      sendMock.mockResolvedValueOnce({});
      await expect(service.deleteTask('404')).rejects.toThrow(HttpException);
    });
  });

  describe('updateTask', () => {
    it('update when exists', async () => {
      sendMock.mockResolvedValueOnce({ Item: { id: '1', name: 'old' } });
      sendMock.mockResolvedValueOnce({});
      const result = await service.updateTask('1', { name: 'New' } as any);
      expect(result).toEqual({ id: '1', name: 'New' });
      expect(PutCommand).toHaveBeenCalledWith({ TableName: 'TasksTable', Item: { id: '1', name: 'New' } });
    });

    it('throw not found if missing', async () => {
      sendMock.mockResolvedValueOnce({});
      await expect(service.updateTask('missing', { name: 'test' } as any)).rejects.toThrow(HttpException);
    });
  });
});
