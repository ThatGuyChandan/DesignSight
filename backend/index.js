
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/uploads', express.static('uploads'));

const projectsRouter = require('./routes/projects');
app.use('/api/projects', projectsRouter);

app.get('/', (req, res) => {
  res.send('DesignSight Backend is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
