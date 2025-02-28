import React, { useState, useCallback } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { usePageContext } from '../context/PageContext';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import ErrorBoundary from './ErrorBoundary';
import { toast } from 'react-toastify';

const TaskBoard = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTaskContext();
  const { selectedPage } = usePageContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'NotStarted',
    priority: 'Medium',
    dueDate: null,
    imageUrl: null,
    subtasks: []
  });

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      status: 'NotStarted',
      priority: 'Medium',
      dueDate: null,
      imageUrl: null,
      subtasks: []
    });
  }, []);

  const handleAddTask = async (taskData) => {
    try {
      if (!selectedPage) {
        toast.error('Please select a page first');
        return;
      }

      const task = {
        ...taskData,
        pageId: selectedPage.id
      };

      await addTask(task);
      toast.success('Task added successfully');
      handleModalClose();
    } catch (err) {
      toast.error(err.message);
      console.error('Error adding task:', err);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
      toast.success('Task updated successfully');
      handleModalClose();
    } catch (err) {
      toast.error(err.message);
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error(err.message);
      console.error('Error deleting task:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const notStartedTasks = tasks.filter(task => task.status === 'NotStarted');
  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const inProgressTasks = tasks.filter(task => task.status === 'StartedWorking');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  if (error) {
    toast.error(error);
  }

  return (
    <ErrorBoundary>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {selectedPage ? selectedPage.title : 'Task Board'}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!selectedPage}
          >
            Add Task
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TaskList
              title="Not Started"
              tasks={notStartedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              status="NotStarted"
            />
            <TaskList
              title="Pending"
              tasks={pendingTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              status="Pending"
            />
            <TaskList
              title="In Progress"
              tasks={inProgressTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              status="StartedWorking"
            />
            <TaskList
              title="Completed"
              tasks={completedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              status="Completed"
            />
          </div>
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={editingTask ? 
            (data) => handleUpdateTask(editingTask.id, data) : 
            handleAddTask}
          task={editingTask || newTask}
        />
      </div>
    </ErrorBoundary>
  );
};

export default TaskBoard; 