import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

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

  async getTaskById(id: string) {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    const result = await this.dynamoDb.send(new GetCommand(params));
    return result.Item || null;
  }

  async createTask(task: any) {
    const existingTask = await this.getTaskById(task.id);
    if (existingTask) {
      throw new Error(`Task with ID ${task.id} already exists.`);
    }

    const newTask = { id: Date.now().toString(), ...task };
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
      throw new Error(`Task with ID ${id} does not exist.`);
    }

    const params = {
      TableName: this.tableName,
      Key: { id },
    };
    await this.dynamoDb.send(new DeleteCommand(params));
    return { message: 'Task deleted successfully' };
  }

  async updateTask(id: string, updates: any) {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) {
      throw new Error(`Task with ID ${id} does not exist.`);
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
