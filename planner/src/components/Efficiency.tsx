import React, { useState, useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { FaQuestionCircle, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { COLORS } from '../constants/colors';
import type { Task } from '../types';

const calculateEfficiency = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(task => task.status === 'Completed');
  const totalWeight = tasks.reduce((acc, task) => {
    switch (task.priority) {
      case 'High':
        return acc + 3;
      case 'Medium':
        return acc + 2;
      case 'Low':
        return acc + 1;
      default:
        return acc;
    }
  }, 0);

  const completedWeight = completedTasks.reduce((acc, task) => {
    switch (task.priority) {
      case 'High':
        return acc + 3;
      case 'Medium':
        return acc + 2;
      case 'Low':
        return acc + 1;
      default:
        return acc;
    }
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
};

const Efficiency: React.FC = () => {
  const { tasks } = useTaskContext();
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  
  const {
    tasksInProgress,
    tasksCompleted,
    tasksWithObjections,
    efficiencyPercentage
  } = useMemo(() => {
    return {
      tasksInProgress: tasks.filter(task => task.status === 'StartedWorking').length,
      tasksCompleted: tasks.filter(task => task.status === 'Completed').length,
      tasksWithObjections: tasks.filter(task => task.status === 'Pending').length,
      efficiencyPercentage: calculateEfficiency(tasks)
    };
  }, [tasks]);
  
  return (
    <div className="task-board">
      <div className="board-header">
        <h2 className="board-title">Efficiency</h2>
        <div className="board-stats">
          <span className="task-count">Current month</span>
        </div>
      </div>

      <div className="efficiency-container">
        <div className="efficiency-card">
          <h3 className="efficiency-title">Efficiency</h3>
          
          <div className="progress-container">
            <div className="circular-progress">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  fill={COLORS.PRIMARY} 
                />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="70" 
                  fill={COLORS.BG_SECONDARY} 
                />
              </svg>
              
              <div className="progress-value-container">
                <span className="progress-value">
                  {efficiencyPercentage}
                </span>
                <span className="progress-percent">%</span>
              </div>
            </div>
          </div>
          
          <div className="tooltip-container">
            <button
              className="help-button"
              onMouseEnter={() => setShowHelpTooltip(true)}
              onMouseLeave={() => setShowHelpTooltip(false)}
            >
              <span>How does it work?</span>
              <FaQuestionCircle />
            </button>
            
            {showHelpTooltip && (
              <div className="tooltip-content">
                <p>
                  Efficiency is calculated based on completed tasks weighted by priority:
                  <br />- High priority: 3 points
                  <br />- Medium priority: 2 points
                  <br />- Low priority: 1 point
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat-card blue">
            <div className="stat-header">
              <FaSpinner className="stat-icon" />
              <h3 className="stat-title">Total in progress</h3>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{tasksInProgress}</span>
            </div>
          </div>
          
          <div className="stat-card green">
            <div className="stat-header">
              <FaCheckCircle className="stat-icon" />
              <h3 className="stat-title">Tasks completed</h3>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{tasksCompleted}</span>
            </div>
          </div>
          
          <div className="stat-card red">
            <div className="stat-header">
              <FaExclamationTriangle className="stat-icon" />
              <h3 className="stat-title">Tasks with objections</h3>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{tasksWithObjections}</span>
            </div>
          </div>
        </div>
        
        <div className="efficiency-card">
          <h3 className="efficiency-title">Daily efficiency</h3>
          <div className="daily-efficiency">
            <div className="chart-container">
              <svg width="100%" height="150" viewBox="0 0 400 150">
                <path 
                  d="M0,75 Q100,25 200,75 T400,75" 
                  stroke={COLORS.PRIMARY} 
                  strokeWidth="3" 
                  fill="none" 
                />
                <circle cx="50" cy="75" r="5" fill={COLORS.PRIMARY} />
                <circle cx="150" cy="50" r="5" fill={COLORS.PRIMARY} />
                <circle cx="250" cy="75" r="5" fill={COLORS.PRIMARY} />
                <circle cx="350" cy="75" r="5" fill={COLORS.PRIMARY} />
              </svg>
              <p className="no-data">
                More data will appear as you complete tasks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Efficiency; 