import { Request } from 'express';

export type TaskStatus = 'NotStarted' | 'Pending' | 'StartedWorking' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
  body: any;
  params: any;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  pageId: string;
  imageUrl?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {} 