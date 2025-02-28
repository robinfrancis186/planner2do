import { Request } from 'express';
import { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  assignedTo?: string;
  createdBy: string;
  pageId?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'with-issues';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  assignedTo?: string;
  pageId?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  imageUrl?: string;
}

export interface TaskRequest extends Request {
  userId: string;
  file?: Express.Multer.File;
}

export interface TaskQuery {
  createdBy: string;
  pageId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  $or?: Array<{ [key: string]: RegExp }>;
} 