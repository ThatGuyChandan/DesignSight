
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ImageUpload = ({ projectId, onImageUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('image', file);

    axios.post(`${API_URL}/projects/${projectId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      onImageUpload(response.data);
      setFile(null);
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload Image
      </button>
    </div>
  );
};

export default ImageUpload;
