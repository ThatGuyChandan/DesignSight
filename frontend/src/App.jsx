import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectView from './components/ProjectView';
import './index.css'; // Import the global CSS

function App() {
  return (
    <Router>
      <div className="App">
        <h1>DesignSight</h1>
        <main className="container"> {/* Apply container class here */}
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/project/:id" element={<ProjectView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;