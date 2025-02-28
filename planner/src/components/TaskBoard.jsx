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
      <div className="task-board">
        <div className="board-header">
          <h1 className="board-title">
            {selectedPage ? selectedPage.title : 'Task Board'}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
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
          <div className="columns-container">
            <div className="task-column">
              <div className="column-header not-started">
                <h2 className="column-title">Not Started</h2>
                <span className="task-count">{notStartedTasks.length}</span>
              </div>
              <div className="column-tasks">
                <TaskList
                  tasks={notStartedTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  status="NotStarted"
                />
              </div>
            </div>

            <div className="task-column">
              <div className="column-header pending">
                <h2 className="column-title">Pending</h2>
                <span className="task-count">{pendingTasks.length}</span>
              </div>
              <div className="column-tasks">
                <TaskList
                  tasks={pendingTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  status="Pending"
                />
              </div>
            </div>

            <div className="task-column">
              <div className="column-header in-progress">
                <h2 className="column-title">In Progress</h2>
                <span className="task-count">{inProgressTasks.length}</span>
              </div>
              <div className="column-tasks">
                <TaskList
                  tasks={inProgressTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  status="StartedWorking"
                />
              </div>
            </div>

            <div className="task-column">
              <div className="column-header completed">
                <h2 className="column-title">Completed</h2>
                <span className="task-count">{completedTasks.length}</span>
              </div>
              <div className="column-tasks">
                <TaskList
                  tasks={completedTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  status="Completed"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className="add-task-btn"
          disabled={!selectedPage}
        >
          +
        </button>

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