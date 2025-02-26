import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { FaImage } from 'react-icons/fa';

const TaskDetails = ({ task, onClose }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [previewImage, setPreviewImage] = useState(task.imageUrl || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedTask({ ...editedTask, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateTask(editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'NotStarted':
        return '#ef4444'; // red
      case 'Pending':
        return '#a855f7'; // purple
      case 'StartedWorking':
        return '#3b82f6'; // blue
      case 'Completed':
        return '#22c55e'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444'; // red
      case 'Medium':
        return '#f59e0b'; // amber
      case 'Low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  // Function to get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'NotStarted':
        return 'Not Started';
      case 'StartedWorking':
        return 'In Progress';
      default:
        return status;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          // Edit Mode
          <div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>Edit Task</h2>
            
            <div className="form-group">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={editedTask.description || ''}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
              />
            </div>
            
            {/* Image Upload Field */}
            <div className="form-group">
              <label htmlFor="taskImageEdit" className="form-label">
                Task Image
              </label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="taskImageEdit"
                  name="taskImageEdit"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input"
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="taskImageEdit" 
                  className="image-upload-label"
                >
                  <FaImage style={{ marginRight: '0.5rem' }} />
                  {previewImage ? 'Change Image' : 'Add Image'}
                </label>
                {previewImage && (
                  <div className="image-preview">
                    <img 
                      src={previewImage} 
                      alt="Task preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px',
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
                        setEditedTask({ ...editedTask, imageUrl: null });
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
                  value={editedTask.status}
                  onChange={handleChange}
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
                  value={editedTask.priority}
                  onChange={handleChange}
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
                value={editedTask.dueDate || ''}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="actions-container">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '0.5rem'
              }}>{task.title}</h2>
              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  color: 'white',
                  backgroundColor: getStatusColor(task.status)
                }}>
                  {getStatusText(task.status)}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '9999px',
                  color: 'white',
                  backgroundColor: getPriorityColor(task.priority)
                }}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            {/* Display task image if available */}
            {task.imageUrl && (
              <div style={{ marginBottom: '1.5rem' }}>
                <img 
                  src={task.imageUrl} 
                  alt="Task attachment" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: '#4b5563'
              }}>Description</h3>
              <p style={{
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}>
                {task.description || 'No description provided.'}
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                color: '#4b5563'
              }}>Details</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  fontSize: '0.875rem'
                }}>
                  <span style={{
                    fontWeight: 500,
                    width: '5rem',
                    color: '#4b5563'
                  }}>Created:</span>
                  <span style={{ color: '#1f2937' }}>
                    {format(new Date(task.createdAt), 'PPP')}
                  </span>
                </div>
                
                {task.dueDate && (
                  <div style={{
                    display: 'flex',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{
                      fontWeight: 500,
                      width: '5rem',
                      color: '#4b5563'
                    }}>Due Date:</span>
                    <span style={{ color: '#1f2937' }}>
                      {format(new Date(task.dueDate), 'PPP')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="actions-container">
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails; 