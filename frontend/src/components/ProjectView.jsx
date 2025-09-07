import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import FeedbackOverlay from './FeedbackOverlay';

const API_URL = 'http://localhost:5000/api';

const ROLES = ['All', 'Designer', 'Reviewer', 'Product Manager', 'Developer'];

const ProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    axios.get(`${API_URL}/projects/${id}`).then((response) => {
      setProject(response.data);
    });
  }, [id]);

  const handleImageUpload = (image) => {
    // After upload, we need to refetch the project to get the new image with feedback
    axios.get(`${API_URL}/projects/${id}`).then((response) => {
      setProject(response.data);
    });
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-view-container">
      <h2>{project.name}</h2>
      <ImageUpload projectId={id} onImageUpload={handleImageUpload} />

      <div className="filter-section">
        <strong>Filter by role:</strong>
        <select onChange={(e) => setSelectedRole(e.target.value)} value={selectedRole}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <h3>Images</h3>
      <div className="image-gallery">
        {project.images.map((image) => (
          <div key={image._id} className="image-card">
            <img src={image.path} alt={image.originalName} className="project-image" />
            <FeedbackOverlay feedback={image.feedback} role={selectedRole} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectView;