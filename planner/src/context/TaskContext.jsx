import React, { createContext, useContext, useState, useEffect } from 'react';
import dbService from '../services/db';

// Create the context
const TaskContext = createContext();

// Custom hook to use the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Provider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await dbService.init();
        const storedTasks = await dbService.getAllTasks();
        setTasks(storedTasks);
      } catch (err) {
        setError('Failed to initialize database: ' + err.message);
        console.error('Database initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeDB();
  }, []);

  const addTask = async (newTask) => {
    try {
      setLoading(true);
      await dbService.addTask(newTask);
      const updatedTasks = await dbService.getAllTasks();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to add task: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      setLoading(true);
      await dbService.updateTask({ ...updatedTask, id: taskId });
      const updatedTasks = await dbService.getAllTasks();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to update task: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setLoading(true);
      await dbService.deleteTask(taskId);
      const updatedTasks = await dbService.getAllTasks();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadTaskImage = async (taskId, imageUrl) => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      const updatedTask = { ...task, imageUrl };
      await dbService.updateTask(updatedTask);
      const updatedTasks = await dbService.getAllTasks();
      setTasks(updatedTasks);
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = async (status) => {
    try {
      setLoading(true);
      return await dbService.getTasksByStatus(status);
    } catch (err) {
      setError('Failed to get tasks by status: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Value to be provided by the context
  const value = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    uploadTaskImage,
    getTasksByStatus,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext; 