const axios = require('axios');
const FormData = require('form-data');
// const fs = require('fs'); // No longer needed for local file reading

const analyzeImage = async (imageUrl) => { // Renamed imagePath to imageUrl for clarity
  try {
    // Fetch image data from S3 URL
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data);
    const imageMimeType = imageResponse.headers['content-type'];

    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: imageUrl.substring(imageUrl.lastIndexOf('/') + 1), // Extract filename from URL
      contentType: imageMimeType,
    });

    const response = await axios.post('http://vision-microservice:8001/analyze-image/', form, {
      headers: {
        ...form.getHeaders(),
        'Content-Type': form.getHeaders()['content-type'], // Ensure correct Content-Type for FormData
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

module.exports = { analyzeImage };