const axios = require('axios');

const analyzeImage = async (imageUrl) => {
  try {
    const response = await axios.post('http://vision-microservice:8001/analyze-image/', {
      imageUrl: imageUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    // Pass along the error message from the microservice if available
    const errorMessage = error.response?.data?.detail || 'Failed to analyze image';
    throw new Error(errorMessage);
  }
};

module.exports = { analyzeImage };