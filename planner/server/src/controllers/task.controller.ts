import { Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '../models/Task';
import { 
  CreateTaskDto, 
  UpdateTaskDto, 
  TaskRequest, 
  TaskQuery,
  TaskStatus,
  TaskPriority 
} from '../types/task.types';

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// Initialize uploads directory
ensureUploadsDir();

export const createTask = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    const taskData: CreateTaskDto = req.body;
    const task = new Task({
      ...taskData,
      createdBy: req.userId,
      status: taskData.status || 'not-started',
      priority: taskData.priority || 'medium'
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    const query: TaskQuery = { createdBy: req.userId };
    
    const pageId = req.query.pageId as string | undefined;
    const status = req.query.status as TaskStatus | undefined;
    const priority = req.query.priority as TaskPriority | undefined;
    const search = req.query.search as string | undefined;

    if (pageId) query.pageId = pageId;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    const task = await Task.findOne({ _id: taskId, createdBy: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    const updates: UpdateTaskDto = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.userId },
      { $set: updates },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    const task = await Task.findOne({ _id: taskId, createdBy: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete associated image if it exists
    const imageUrl = task.get('imageUrl');
    if (imageUrl) {
      const imagePath = path.join(UPLOADS_DIR, path.basename(imageUrl));
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadTaskImage = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, req.file.buffer);
    
    const imageUrl = `/uploads/${fileName}`;
    
    const taskId = req.params.taskId;
    if (taskId) {
      const task = await Task.findOneAndUpdate(
        { _id: taskId, createdBy: req.userId },
        { $set: { imageUrl } },
        { new: true }
      );
      
      if (!task) {
        await fs.unlink(filePath);
        return res.status(404).json({ message: 'Task not found' });
      }
    }
    
    res.json({ imageUrl });
  } catch (error) {
    next(error);
  }
};

export const downloadTaskImage = async (req: TaskRequest, res: Response, next: NextFunction) => {
  try {
    const fileName = req.params.fileName;
    if (!fileName) {
      return res.status(400).json({ message: 'File name is required' });
    }

    const filePath = path.join(UPLOADS_DIR, fileName);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.download(filePath);
  } catch (error) {
    next(error);
  }
}; 