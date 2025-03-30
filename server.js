const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let currentStatus = "unknown";

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// API endpoint: GET current status
app.get('/api/status', (req, res) => {
  res.json({ status: currentStatus });
});

// API endpoint: POST update status
app.post('/api/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  currentStatus = status.toLowerCase();
  console.log(`Status updated to: ${currentStatus}`);
  res.json({ status: currentStatus });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
