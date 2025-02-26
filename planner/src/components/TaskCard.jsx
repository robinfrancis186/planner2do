import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaImage } from 'react-icons/fa';

const TaskCard = ({ task, onOpenDetails }) => {
  const { title, description, priority, dueDate, status, imageUrl } = task;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
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

  // Format the due date
  const formattedDueDate = dueDate 
    ? formatDistanceToNow(new Date(dueDate), { addSuffix: true }) 
    : 'No due date';

  return (
    <div 
      className={`task-card ${getStatusClass()}`}
      onClick={() => onOpenDetails(task)}
      draggable
      onDragStart={handleDragStart}
      style={{ borderLeft: `4px solid ${getStatusBorderColor(status)}` }}
    >
      <div className="task-header">
        <h4 className="task-title">{title}</h4>
        <span className={`task-priority ${getPriorityClass()}`}>
          {priority}
        </span>
      </div>
      
      {description && (
        <p className="task-description">
          {description.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description}
        </p>
      )}
      
      {/* Preview of image if available */}
      {imageUrl && (
        <div className="task-image-preview">
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
        <span className="task-due-date">{formattedDueDate}</span>
        {imageUrl && (
          <span className="task-has-image">
            <FaImage style={{ color: '#3b82f6', fontSize: '0.875rem' }} />
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