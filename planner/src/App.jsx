import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import { TaskProvider } from './context/TaskContext';
import { PageProvider } from './context/PageContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <PageProvider>
        <ErrorBoundary>
          <TaskProvider>
            <Layout />
          </TaskProvider>
        </ErrorBoundary>
      </PageProvider>
    </Router>
  );
}

export default App;
