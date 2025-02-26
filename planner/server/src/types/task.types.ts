import { Request } from 'express';
import { Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'with-issues';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  createdBy: string;
  pageId?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: 'not-started' | 'in-progress' | 'completed' | 'with-issues';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  pageId?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  imageUrl?: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export interface TaskQuery {
  createdBy?: string;
  pageId?: string;
  status?: string;
  priority?: string;
  search?: string;
  $or?: Array<{ [key: string]: RegExp }>;
} 