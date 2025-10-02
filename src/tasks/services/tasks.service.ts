import * as dotenv from 'dotenv';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { TaskResponse } from '../types/task-response.type';
import { TaskDto } from '../dto/task.dto';

// dotenv.config();

@Injectable()
export class TasksService {
  private readonly dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private readonly tableName = 'TasksTable';
  private readonly logger = new Logger(TasksService.name);

  async getAllTasks() {
    this.logger.debug('getAllTasks: Fetching all tasks');
    const params = {
      TableName: this.tableName,
    };
    const result = await this.dynamoDb.send(new ScanCommand(params));
    const count = result.Items ? result.Items.length : 0;
    this.logger.log(`getAllTasks: Retrieved ${count} task(s)`);
    return result.Items || [];
  }

  async getTaskById(id: string): Promise<TaskResponse | null> {
    this.logger.debug(`getTaskById: Fetching ${id}`);
    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    const result = await this.dynamoDb.send(new GetCommand(params));
    this.logger.log(`getTaskById: Result ${result}`);
    return result.Item as TaskResponse | null;
  }

  async createTask(task: TaskDto) {
    this.logger.debug(`createTask: Creating ${task.id}`);
    const existingTask = await this.getTaskById(task.id);
    if (existingTask) {
      this.logger.warn(`createTask: failed: task ${task.id} already exists`);
      throw new HttpException(`Task with ID ${task.id} already exists.`, HttpStatus.CONFLICT);
    }

    const { id, ...rest } = task;
    const newTask = { id, ...rest };
    const params = {
      TableName: this.tableName,
      Item: newTask,
    };
    await this.dynamoDb.send(new PutCommand(params));
    this.logger.log(`createTask: Task ${task.id} created`);
    return newTask;
  }

  async deleteTask(id: string) {
    this.logger.debug(`deleteTask: task id=${id}`);
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      this.logger.warn(`deleteTask failed: task ${id} does not exist`);
      throw new HttpException(`Task with ID ${id} does not exist.`, HttpStatus.NOT_FOUND);
    }

    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    await this.dynamoDb.send(new DeleteCommand(params));
    this.logger.log(`Task ${id} deleted`);
    return { message: 'Task deleted successfully' };
  }

  async updateTask(id: string, updates: Partial<TaskDto>) {
    this.logger.debug(`updateTask: task id=${id}`);
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      this.logger.warn(`updateTask failed: task ${id} does not exist`);
      throw new HttpException(`Task with ID ${id} does not exist.`, HttpStatus.NOT_FOUND);
    }

    const updatedTask = { ...existingTask, ...updates };
    const params = {
      TableName: this.tableName,
      Item: updatedTask,
    };
    await this.dynamoDb.send(new PutCommand(params));
    this.logger.log(`updateTask: Task ${id} updated`);
    return updatedTask;
  }
}
