import React, { useState } from 'react';
import TaskColumn from './TaskColumn';
import TaskDetails from './TaskDetails';
import { useTaskContext } from '../context/TaskContext';
import { usePageContext } from '../context/PageContext';
import { FaImage } from 'react-icons/fa';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <p className="text-red-500 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Retry
    </button>
  </div>
);

const TaskBoard = () => {
  const { tasks, loading, error, addTask, clearError } = useTaskContext();
  const { selectedPage } = usePageContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'NotStarted',
    priority: 'Medium',
    dueDate: '',
    imageUrl: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  // If no page is selected, show a message
  if (!selectedPage) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        padding: '2rem' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '400px' 
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem' 
          }}>No Page Selected</h2>
          <p style={{ color: '#6b7280' }}>
            Please select a page from the sidebar or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  // Filter tasks for the selected page
  const pageTasks = tasks.filter(task => task.pageId === selectedPage.id);

  // Group tasks by status
  const tasksByStatus = {
    NotStarted: pageTasks.filter(task => task.status === 'NotStarted'),
    Pending: pageTasks.filter(task => task.status === 'Pending'),
    StartedWorking: pageTasks.filter(task => task.status === 'StartedWorking'),
    Completed: pageTasks.filter(task => task.status === 'Completed'),
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewTask({ ...newTask, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await addTask({
        ...newTask,
        pageId: selectedPage.id
      });
      setNewTask({
        title: '',
        description: '',
        status: 'NotStarted',
        priority: 'Medium',
        dueDate: '',
        imageUrl: ''
      });
      setPreviewImage(null);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleOpenTaskDetails = (task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => {
          clearError();
          window.location.reload();
        }} 
      />
    );
  }

  return (
    <div className="task-board">
      <div className="board-header">
        <h2 className="board-title">{selectedPage.name}</h2>
        <div className="board-stats">
          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px'
          }}>
            {pageTasks.length} {pageTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <button 
          className="add-task-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Task
        </button>
      </div>

      <div className="columns-container">
        <TaskColumn 
          title="Not Started" 
          status="NotStarted" 
          tasks={tasksByStatus.NotStarted}
          onOpenDetails={handleOpenTaskDetails}
        />
        <TaskColumn 
          title="Pending" 
          status="Pending" 
          tasks={tasksByStatus.Pending}
          onOpenDetails={handleOpenTaskDetails}
        />
        <TaskColumn 
          title="In Progress" 
          status="StartedWorking" 
          tasks={tasksByStatus.StartedWorking}
          onOpenDetails={handleOpenTaskDetails}
        />
        <TaskColumn 
          title="Completed" 
          status="Completed" 
          tasks={tasksByStatus.Completed}
          onOpenDetails={handleOpenTaskDetails}
        />
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>Add New Task</h2>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              
              {/* Image Upload Field */}
              <div className="form-group">
                <label htmlFor="taskImage" className="form-label">
                  Add Image (optional)
                </label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="taskImage"
                    name="taskImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-input"
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor="taskImage" 
                    className="image-upload-label"
                  >
                    <FaImage style={{ marginRight: '0.5rem' }} />
                    Choose Image
                  </label>
                  {previewImage && (
                    <div className="image-preview">
                      <img 
                        src={previewImage} 
                        alt="Task preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '150px',
                          objectFit: 'contain',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb'
                        }} 
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                          setPreviewImage(null);
                          setNewTask({ ...newTask, imageUrl: '' });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newTask.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="NotStarted">Not Started</option>
                    <option value="Pending">Pending</option>
                    <option value="StartedWorking">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="actions-container">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetails 
          task={selectedTask} 
          onClose={handleCloseTaskDetails} 
        />
      )}
    </div>
  );
};

export default TaskBoard; 