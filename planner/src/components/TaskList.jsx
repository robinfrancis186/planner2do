import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TaskList = ({ title, tasks, onEdit, onDelete, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'NotStarted':
        return 'bg-gray-100';
      case 'Pending':
        return 'bg-yellow-100';
      case 'StartedWorking':
        return 'bg-blue-100';
      case 'Completed':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${getStatusColor(status)}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {task.imageUrl && (
              <img
                src={task.imageUrl}
                alt={task.title}
                className="mt-2 rounded-md max-h-24 object-cover"
              />
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Subtasks</h5>
                <ul className="text-sm text-gray-600 list-disc list-inside">
                  {task.subtasks.map((subtask, index) => (
                    <li key={index}>{subtask.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 