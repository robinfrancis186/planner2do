export type TaskStatus = 'NotStarted' | 'Pending' | 'StartedWorking' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
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