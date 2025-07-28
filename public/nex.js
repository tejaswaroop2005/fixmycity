const express = require('express');
const app = express();
const port = 3000;

// GET route
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page');
});

// POST route
app.post('/submit', (req, res) => {
  res.send('Form Submitted!');
});

// PUT route
app.put('/update', (req, res) => {
  res.send('Data Updated Successfully!');
});

// DELETE route
app.delete('/delete', (req, res) => {
  res.send('Data deleted successfully!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
