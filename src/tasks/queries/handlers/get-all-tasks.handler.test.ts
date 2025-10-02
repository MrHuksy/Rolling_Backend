import { GetAllTasksHandler } from './get-all-tasks.handler';

describe('GetAllTasksHandler', () => {
  let tasksService: { getAllTasks: jest.Mock };
  let handler: GetAllTasksHandler;

  beforeEach(() => {
    tasksService = { getAllTasks: jest.fn() };
    handler = new GetAllTasksHandler(tasksService as any);
  });

  it('returns mapped tasks array', async () => {
    const rawTasks = [
      { id: '1', complete: false, created: '2024-01-01', description: 'd1', due: '2024-02-01', title: 'T1', extra: 'x' },
      { id: '2', complete: true, created: '2024-01-02', description: 'd2', due: '2024-02-02', title: 'T2' },
    ];
    tasksService.getAllTasks.mockResolvedValueOnce(rawTasks);

    const result = await handler.execute();

    expect(result).toEqual([
      { id: '1', complete: false, created: '2024-01-01', description: 'd1', due: '2024-02-01', title: 'T1' },
      { id: '2', complete: true, created: '2024-01-02', description: 'd2', due: '2024-02-02', title: 'T2' },
    ]);
    expect(tasksService.getAllTasks).toHaveBeenCalledTimes(1);
  });

  it('returns empty array if service returns non-array', async () => {
    tasksService.getAllTasks.mockResolvedValueOnce(null);
    const result = await handler.execute();
    expect(result).toEqual([]);
  });

  it('propagates errors from service', async () => {
    const error = new Error('error');
    tasksService.getAllTasks.mockRejectedValueOnce(error);
    await expect(handler.execute()).rejects.toThrow('error');
  });
});
