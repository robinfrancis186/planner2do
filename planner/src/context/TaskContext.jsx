import React, { createContext, useContext, useState, useEffect } from 'react';
import dbService from '../services/db';
import { usePageContext } from './PageContext';

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
  const { selectedPage } = usePageContext();

  const clearError = () => setError(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        setError(null);
        setLoading(true);
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

  useEffect(() => {
    if (selectedPage) {
      const loadPageTasks = async () => {
        try {
          setError(null);
          setLoading(true);
          const pageTasks = await dbService.getTasksByPage(selectedPage.id);
          setTasks(pageTasks);
        } catch (err) {
          setError('Failed to load page tasks: ' + err.message);
          console.error('Failed to load page tasks:', err);
        } finally {
          setLoading(false);
        }
      };

      loadPageTasks();
    }
  }, [selectedPage]);

  const addTask = async (newTask) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!newTask.title) {
        throw new Error('Task title is required');
      }

      const taskToAdd = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        title: newTask.title,
        description: newTask.description || '',
        pageId: selectedPage?.id,
        status: newTask.status || 'NotStarted',
        priority: newTask.priority || 'Medium',
        dueDate: newTask.dueDate || null,
        imageUrl: newTask.imageUrl || null,
        subtasks: Array.isArray(newTask.subtasks) ? newTask.subtasks : []
      };
      
      const addedTask = await dbService.addTask(taskToAdd);
      setTasks(prevTasks => [...prevTasks, addedTask]);
      return addedTask;
    } catch (err) {
      const errorMessage = 'Failed to add task: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updatedFields) => {
    try {
      setError(null);
      setLoading(true);
      
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) {
        throw new Error('Task not found');
      }

      const updatedTask = {
        ...taskToUpdate,
        ...updatedFields,
        id: taskId, // Ensure ID doesn't change
        subtasks: Array.isArray(updatedFields.subtasks) 
          ? updatedFields.subtasks 
          : taskToUpdate.subtasks || []
      };

      await dbService.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      const errorMessage = 'Failed to update task: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError(null);
      setLoading(true);
      await dbService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      const errorMessage = 'Failed to delete task: ' + err.message;
      setError(errorMessage);
      console.error(errorMessage, err);
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
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === taskId ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeTaskStatus = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      return await updateTask(taskId, { status: newStatus });
    } catch (err) {
      setError('Failed to change task status: ' + err.message);
      throw err;
    }
  };

  // Value to be provided by the context
  const value = {
    tasks,
    loading,
    error,
    clearError,
    addTask,
    updateTask,
    deleteTask,
    uploadTaskImage,
    changeTaskStatus
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext; 