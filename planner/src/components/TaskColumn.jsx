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

  return (
    <div 
      className="task-column"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className={`column-header ${getHeaderColorClass()}`}>
        <h3 className="column-title">{title}</h3>
        <div>
          <span className="task-count">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>
      
      <div className="column-tasks">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onOpenDetails={onOpenDetails} 
            />
          ))
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '6rem', 
            border: '2px dashed #e5e7eb', 
            borderRadius: '0.375rem' 
          }}>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn; 