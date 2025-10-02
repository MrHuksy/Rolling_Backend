import * as dotenv from 'dotenv';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { TaskResponse } from '../types/task-response.type';
import { TaskDto } from '../dto/task.dto';

// dotenv.config();

@Injectable()
export class TasksService {
  private readonly dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  private readonly tableName = 'TasksTable';

  async getAllTasks() {
    const params = {
      TableName: this.tableName,
    };
    const result = await this.dynamoDb.send(new ScanCommand(params));
    return result.Items || [];
  }

  async getTaskById(id: string): Promise<TaskResponse | null> {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    const result = await this.dynamoDb.send(new GetCommand(params));
    return result.Item as TaskResponse | null;
  }

  async createTask(task: TaskDto) {
    const existingTask = await this.getTaskById(task.id);
    if (existingTask) {
      throw new HttpException(`Task with ID ${task.id} already exists.`, HttpStatus.CONFLICT);
    }

    const { id, ...rest } = task;
    const newTask = { id, ...rest };
    const params = {
      TableName: this.tableName,
      Item: newTask,
    };
    await this.dynamoDb.send(new PutCommand(params));
    return newTask;
  }

  async deleteTask(id: string) {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      throw new HttpException(`Task with ID ${id} does not exist.`, HttpStatus.NOT_FOUND);
    }

    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    await this.dynamoDb.send(new DeleteCommand(params));
    return { message: 'Task deleted successfully' };
  }

  async updateTask(id: string, updates: Partial<TaskDto>) {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      throw new HttpException(`Task with ID ${id} does not exist.`, HttpStatus.NOT_FOUND);
    }

    const updatedTask = { ...existingTask, ...updates };
    const params = {
      TableName: this.tableName,
      Item: updatedTask,
    };
    await this.dynamoDb.send(new PutCommand(params));
    return updatedTask;
  }
}
