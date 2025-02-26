export type TaskStatus = 'NotStarted' | 'Pending' | 'StartedWorking' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  pageId: string;
  createdAt: string;
  imageUrl?: string;
}

export interface Page {
  id: string;
  name: string;
  color: string;
}

export interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (taskId: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  uploadTaskImage: (taskId: string, imageUrl: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Promise<Task[]>;
  clearError: () => void;
}

export interface PageContextType {
  pages: Page[];
  selectedPage: Page | null;
  setSelectedPage: (page: Page | null) => void;
  addPage: (name: string) => Page;
  deletePage: (pageId: string) => void;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
}

export interface DatabaseService {
  init(): Promise<void>;
  getAllTasks(): Promise<Task[]>;
  addTask(task: Task): Promise<string>;
  updateTask(task: Task): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
  getTasksByStatus(status: TaskStatus): Promise<Task[]>;
} 