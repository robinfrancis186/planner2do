import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No tasks in this column
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
                title="Edit task"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
                title="Delete task"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="flex items-center gap-3 mb-3">
            <span className={`task-priority ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {task.imageUrl && (
            <div className="mb-3">
              <img
                src={task.imageUrl}
                alt={task.title}
                className="rounded-lg w-full h-32 object-cover"
              />
            </div>
          )}

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="border-t border-gray-100 pt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Subtasks</h4>
              <ul className="space-y-1">
                {task.subtasks.map((subtask, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                    {subtask.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList; 