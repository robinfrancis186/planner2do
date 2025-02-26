import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaImage, FaTasks } from 'react-icons/fa';

const TaskCard = ({ task, onOpenDetails }) => {
  const { title, description, priority, dueDate, status, imageUrl, subtasks } = task;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDetails(task);
    }
  };

  // Function to get priority class
  const getPriorityClass = () => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  };

  // Function to get status class
  const getStatusClass = () => {
    switch (status) {
      case 'NotStarted':
        return 'status-not-started';
      case 'Pending':
        return 'status-pending';
      case 'StartedWorking':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  // Calculate subtask progress
  const getSubtaskProgress = () => {
    if (!subtasks?.length) return null;
    const completed = subtasks.filter(st => st.completed).length;
    return `${completed}/${subtasks.length}`;
  };

  // Format the due date
  const formattedDueDate = dueDate 
    ? formatDistanceToNow(new Date(dueDate), { addSuffix: true }) 
    : 'No due date';

  return (
    <div 
      className={`task-card ${getStatusClass()}`}
      onClick={() => onOpenDetails(task)}
      onKeyPress={handleKeyPress}
      draggable
      onDragStart={handleDragStart}
      style={{ borderLeft: `4px solid ${getStatusBorderColor(status)}` }}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${title}, Priority: ${priority}, Status: ${status}`}
    >
      <div className="task-header">
        <h4 className="task-title" role="heading" aria-level={4}>{title}</h4>
        <span 
          className={`task-priority ${getPriorityClass()}`}
          role="status"
          aria-label={`Priority: ${priority}`}
        >
          {priority}
        </span>
      </div>
      
      {description && (
        <p 
          className="task-description"
          role="note"
          aria-label="Task description"
        >
          {description.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description}
        </p>
      )}
      
      {/* Preview of image if available */}
      {imageUrl && (
        <div 
          className="task-image-preview"
          role="img"
          aria-label="Task attachment preview"
        >
          <img 
            src={imageUrl} 
            alt="Task attachment" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80px',
              borderRadius: '0.25rem',
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }} 
          />
        </div>
      )}
      
      <div className="task-footer">
        <div className="task-meta">
          <span 
            className="task-due-date"
            role="time"
            aria-label={`Due ${formattedDueDate}`}
          >
            {formattedDueDate}
          </span>
          {subtasks?.length > 0 && (
            <span 
              className="task-subtasks"
              role="status"
              aria-label={`Subtasks completed: ${getSubtaskProgress()}`}
            >
              <FaTasks style={{ marginRight: '0.25rem' }} aria-hidden="true" />
              {getSubtaskProgress()}
            </span>
          )}
        </div>
        {imageUrl && (
          <span 
            className="task-has-image"
            role="img"
            aria-label="Task has an image attachment"
          >
            <FaImage style={{ color: '#3b82f6' }} aria-hidden="true" />
          </span>
        )}
      </div>
    </div>
  );
};

// Function to get status border color
const getStatusBorderColor = (status) => {
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
      return '#e5e7eb'; // gray
  }
};

export default TaskCard; 