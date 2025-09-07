const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const analyzeImage = async (imagePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const response = await axios.post('http://vision-microservice:8001/analyze-image/', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    // For now, we'll just return the raw response from the vision microservice.
    // In a later step, we'll process this into the structured feedback JSON.
    return response.data;

  } catch (error) {
    console.error('Error analyzing image:', error.message);
    throw new Error('Failed to analyze image');
  }
};

module.exports = { analyzeImage };