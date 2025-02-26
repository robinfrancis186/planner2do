import React from 'react';
import TaskCard from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

const TaskColumn = ({ title, status, tasks, onOpenDetails }) => {
  const { changeTaskStatus } = useTaskContext();

  // Function to get header color class based on status
  const getHeaderColorClass = () => {
    switch (status) {
      case 'NotStarted':
        return 'not-started';
      case 'Pending':
        return 'pending';
      case 'StartedWorking':
        return 'in-progress';
      case 'Completed':
        return 'completed';
      default:
        return '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      changeTaskStatus(taskId, status);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const columns = document.querySelectorAll('.task-column');
      const currentIndex = Array.from(columns).indexOf(e.currentTarget);
      let nextIndex;

      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : columns.length - 1;
      } else {
        nextIndex = currentIndex < columns.length - 1 ? currentIndex + 1 : 0;
      }

      columns[nextIndex].focus();
    }
  };

  return (
    <div 
      className="task-column"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`${title} column`}
      tabIndex={0}
    >
      <div 
        className={`column-header ${getHeaderColorClass()}`}
        role="heading"
        aria-level={3}
      >
        <h3 className="column-title">{title}</h3>
        <div>
          <span 
            className="task-count"
            role="status"
            aria-label={`${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}
          >
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>
      
      <div 
        className="column-tasks"
        role="list"
        aria-label={`${title} tasks`}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} role="listitem">
              <TaskCard 
                task={task} 
                onOpenDetails={onOpenDetails} 
              />
            </div>
          ))
        ) : (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '6rem', 
              border: '2px dashed #e5e7eb', 
              borderRadius: '0.375rem' 
            }}
            role="status"
            aria-label="No tasks in this column"
          >
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn; 