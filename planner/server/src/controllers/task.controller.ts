import { Request, Response, NextFunction } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { Task } from '../models/Task';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';

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

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
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

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: any = { createdBy: req.userId };
    
    if (req.query.pageId) query.pageId = req.query.pageId;
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query['$or'] = [
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

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates: UpdateTaskDto = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
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

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete associated image if it exists
    if (task.imageUrl) {
      const imagePath = path.join(UPLOADS_DIR, path.basename(task.imageUrl));
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const uploadTaskImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, req.file.buffer);
    
    const imageUrl = `/uploads/${fileName}`;
    
    if (req.params.taskId) {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.taskId, createdBy: req.userId },
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

export const downloadTaskImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fileName = req.params.fileName;
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