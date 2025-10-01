import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TasksService {
  private readonly dbPath = path.join(__dirname, '../../../db.json');

  private readDb() {
    const data = fs.readFileSync(this.dbPath, 'utf-8');
    return JSON.parse(data);
  }

  private writeDb(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  getAllTasks() {
    const db = this.readDb();
    return db.tasks;
  }

  getTaskById(id: string) {
    const db = this.readDb();
    return db.tasks.find((task: any) => task.id === id);
  }

  createTask(task: any) {
    const db = this.readDb();
    const newTask = { id: Date.now().toString(), ...task };
    db.tasks.push(newTask);
    this.writeDb(db);
    return newTask;
  }

  deleteTask(id: string) {
    const db = this.readDb();
    const index = db.tasks.findIndex((task: any) => task.id === id);
    if (index !== -1) {
      db.tasks.splice(index, 1);
      this.writeDb(db);
      return { message: 'Task deleted successfully' };
    }
    return null;
  }

  updateTask(id: string, updates: any) {
    const db = this.readDb();
    const task = db.tasks.find((task: any) => task.id === id);
    if (task) {
      Object.assign(task, updates);
      this.writeDb(db);
      return task;
    }
    return null;
  }
}
