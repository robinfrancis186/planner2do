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

  useEffect(() => {
    if (selectedPage) {
      const loadPageTasks = async () => {
        try {
          setLoading(true);
          const pageTasks = await dbService.getTasksByPage(selectedPage.id);
          setTasks(pageTasks);
        } catch (err) {
          setError('Failed to load page tasks: ' + err.message);
        } finally {
          setLoading(false);
        }
      };

      loadPageTasks();
    }
  }, [selectedPage]);

  const addTask = async (newTask) => {
    try {
      setLoading(true);
      const taskToAdd = {
        ...newTask,
        pageId: selectedPage?.id,
        status: newTask.status || 'NotStarted',
        priority: newTask.priority || 'Medium',
        subtasks: []
      };
      
      const addedTask = await dbService.addTask(taskToAdd);
      setTasks(prevTasks => [...prevTasks, addedTask]);
      return addedTask;
    } catch (err) {
      setError('Failed to add task: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updatedFields) => {
    try {
      setLoading(true);
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) throw new Error('Task not found');

      const updatedTask = {
        ...taskToUpdate,
        ...updatedFields
      };

      await dbService.updateTask(updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      return updatedTask;
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
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
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
    changeTaskStatus,
    clearError
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext; 