const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/body-detection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/body_detection.html'));
});

app.get('/object-detection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/object_detection.html'));
});

app.get('/text-detection', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/text_detection.html'));
});