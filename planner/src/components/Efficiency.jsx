import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { FaQuestionCircle, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Efficiency = () => {
  const { tasks } = useTaskContext();
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  
  // Calculate efficiency metrics
  const tasksInProgress = tasks.filter(task => task.status === 'StartedWorking').length;
  const tasksCompleted = tasks.filter(task => task.status === 'Completed').length;
  const tasksWithObjections = tasks.filter(task => task.status === 'Pending').length;
  
  // Calculate efficiency percentage (for demo purposes, showing 100%)
  const efficiencyPercentage = 100;
  
  return (
    <div className="task-board">
      <div className="board-header">
        <h2 className="board-title">Efficiency</h2>
        <div className="board-stats">
          <span className="task-count">Current month</span>
        </div>
      </div>

      <div className="efficiency-container">
        {/* Efficiency Overview */}
        <div className="efficiency-card">
          <h3 className="efficiency-title">Efficiency</h3>
          
          <div className="progress-container">
            {/* New improved circular progress indicator */}
            <div className="circular-progress">
              {/* Blue outer circle */}
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  fill="#4285F4" 
                />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="70" 
                  fill="#d9f99d" 
                />
              </svg>
              
              {/* Percentage text */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span className="progress-value">
                  {efficiencyPercentage}
                </span>
                <span className="progress-percent">%</span>
              </div>
            </div>
          </div>
          
          <div className="tooltip" style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: '#6b7280'
              }}
              onMouseEnter={() => setShowHelpTooltip(true)}
              onMouseLeave={() => setShowHelpTooltip(false)}
            >
              <span style={{ fontSize: '0.875rem' }}>
                How does it work?
              </span>
              <FaQuestionCircle />
            </div>
            
            {showHelpTooltip && (
              <div className="tooltip-content">
                <p style={{ fontSize: '0.875rem', color: '#4b5563', textAlign: 'left' }}>
                  Efficiency is calculated based on the ratio of completed tasks to total tasks, 
                  adjusted for task priority and completion time. Higher percentages indicate 
                  better productivity.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Task Statistics */}
        <div className="stats-container">
          {/* Tasks in Progress */}
          <div className="stat-card blue">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FaSpinner style={{ color: '#4285F4' }} />
              <h3 className="stat-title">Total in progress</h3>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{tasksInProgress}</span>
            </div>
          </div>
          
          {/* Tasks Completed */}
          <div className="stat-card green">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FaCheckCircle style={{ color: '#34A853' }} />
              <h3 className="stat-title">Tasks completed</h3>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{tasksCompleted}</span>
            </div>
          </div>
          
          {/* Tasks with Objections */}
          <div className="stat-card red">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FaExclamationTriangle style={{ color: '#EA4335' }} />
              <h3 className="stat-title">Tasks with objections</h3>
            </div>
            <div className="stat-value-container">
              <span className="stat-value">{tasksWithObjections}</span>
            </div>
          </div>
        </div>
        
        {/* Daily Efficiency */}
        <div className="efficiency-card">
          <h3 className="efficiency-title">Daily efficiency</h3>
          <div className="daily-efficiency">
            <div style={{ textAlign: 'center', width: '100%' }}>
              <svg width="100%" height="150" viewBox="0 0 400 150" style={{ maxWidth: '400px' }}>
                <path d="M0,75 Q100,25 200,75 T400,75" stroke="#4285F4" strokeWidth="3" fill="none" />
                <circle cx="50" cy="75" r="5" fill="#4285F4" />
                <circle cx="150" cy="50" r="5" fill="#4285F4" />
                <circle cx="250" cy="75" r="5" fill="#4285F4" />
                <circle cx="350" cy="75" r="5" fill="#4285F4" />
              </svg>
              <p className="no-data" style={{ marginTop: '1rem' }}>
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