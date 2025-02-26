import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TaskBoard from './TaskBoard';
import Efficiency from './Efficiency';

const Layout = () => {
  const [showEfficiency, setShowEfficiency] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar onEfficiencyClick={() => setShowEfficiency(true)} onPageClick={() => setShowEfficiency(false)} />
      <main className="main-content">
        {showEfficiency ? <Efficiency /> : <TaskBoard />}
      </main>
    </div>
  );
};

export default Layout; 