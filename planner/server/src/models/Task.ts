import mongoose from 'mongoose';
import { ITask } from '../types/task.types';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'with-issues'],
    default: 'not-started'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  assignedTo: {
    type: String
  },
  createdBy: {
    type: String,
    required: true
  },
  pageId: {
    type: String
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ createdBy: 1, pageId: 1 });
taskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model<ITask>('Task', taskSchema); 