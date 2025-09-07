
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/projects`).then((response) => {
      setProjects(response.data);
    });
  }, []);

  const handleCreateProject = () => {
    axios.post(`${API_URL}/projects`, { name: newProjectName }).then((response) => {
      setProjects([...projects, response.data]);
      setNewProjectName('');
    });
  };

  return (
    <div className="project-list-container">
      <h2>Projects</h2>
      <div className="create-project-form">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New Project Name"
        />
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
      <ul className="project-cards">
        {projects.map((project) => (
          <li key={project._id} className="project-card">
            <Link to={`/project/${project._id}`}>
              <h3>{project.name}</h3>
              <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
