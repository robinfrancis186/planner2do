import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { format } from 'date-fns';
import { FaImage, FaTrash, FaPlus, FaCheck, FaUpload, FaTimes } from 'react-icons/fa';

const TaskDetails = ({ task, onClose }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...task,
    subtasks: task.subtasks || []
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Update formData when task prop changes
    setFormData({
      ...task,
      subtasks: task.subtasks || []
    });
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', file);

      // Convert image to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error handling image:', error);
      alert('Failed to process image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: null }));
    setImageFile(null);
  };

  const handleSave = async () => {
    try {
      let updatedData = { ...formData };

      // If there's a new image file, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        try {
          // You'll need to implement the actual image upload API endpoint
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const { imageUrl } = await response.json();
            updatedData.imageUrl = imageUrl;
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. The task will be saved without the new image.');
        }
      }

      await updateTask(task.id, updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        onClose();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;

    const newSubtaskObj = {
      id: Date.now().toString(),
      title: newSubtask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtaskObj]
    }));
    setNewSubtask('');
    setShowSubtaskInput(false);
  };

  const handleToggleSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  const handleDeleteSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
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
    <div 
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
    >
      <div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        <h2 id="task-details-title" className="sr-only">Task Details</h2>
        
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            name="title"
            value={formData.title}
            onChange={handleChange}
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-textarea"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            aria-required="false"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              className="form-input"
              name="status"
              value={formData.status}
              onChange={handleChange}
              aria-required="true"
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
              className="form-input"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              aria-required="true"
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
            id="dueDate"
            type="date"
            className="form-input"
            name="dueDate"
            value={formData.dueDate || ''}
            onChange={handleChange}
            aria-required="false"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image</label>
          <div 
            className="image-upload-container"
            role="region"
            aria-label="Image upload section"
          >
            <label 
              htmlFor="image"
              className="image-upload-label"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('image').click();
                }
              }}
            >
              <FaUpload /> Upload Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              aria-label="Upload task image"
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img 
                  src={formData.imageUrl} 
                  alt="Task attachment preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        </div>

        <div 
          className="subtasks-section"
          role="region"
          aria-label="Subtasks section"
        >
          <h4>Subtasks</h4>
          <div 
            className="subtasks-list"
            role="list"
          >
            {formData.subtasks.map((subtask) => (
              <div 
                key={subtask.id}
                className="subtask-item"
                role="listitem"
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => handleToggleSubtask(subtask.id)}
                  id={`subtask-${subtask.id}`}
                  aria-label={`Mark subtask "${subtask.title}" as ${subtask.completed ? 'incomplete' : 'complete'}`}
                />
                <label 
                  htmlFor={`subtask-${subtask.id}`}
                  className={subtask.completed ? 'completed' : ''}
                >
                  {subtask.title}
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="delete-subtask-btn"
                  aria-label={`Delete subtask "${subtask.title}"`}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-subtask">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a subtask..."
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newSubtask.trim()) {
                  handleAddSubtask();
                }
              }}
              aria-label="New subtask title"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              disabled={!newSubtask.trim()}
              aria-label="Add subtask"
              className="add-subtask-btn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="actions-container">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            aria-label="Save task"
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            aria-label="Cancel and close"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 