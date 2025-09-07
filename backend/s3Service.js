const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS with your access and secret key.
// These should be loaded from environment variables for security.
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION // e.g., 'us-east-1'
});

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const uploadFileToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path); // file.path is the temporary path from multer disk storage

  const uploadParams = {
    Bucket: S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${file.originalname}`, // Unique key for the file in S3
    Body: fileStream,
    ContentType: file.mimetype,
    ACL: 'public-read' // Make the uploaded file publicly accessible
  };

  try {
    const data = await s3.upload(uploadParams).promise();
    console.log('File uploaded successfully:', data.Location);
    return data.Location; // Returns the S3 URL of the uploaded file
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    throw err;
  }
};

module.exports = { uploadFileToS3 };