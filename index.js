const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Allow cross-origin requests

let latestData = { voltage: 0, current: 0 }; // Store latest sensor data

// add the public file from the frontend
app.use(express.static(path.join(__dirname,'public')));

// Endpoint to receive data from ESP32 (POST)
app.post('/api/update', (req, res) => {
  const { voltage, current } = req.body;

  if (typeof voltage === 'number' && typeof current === 'number') {
    latestData = { voltage, current }; // Update stored data
    console.log('Updated Data - Voltage: ', latestData.voltage,'V, Current: ',latestData.current,' mA');
    res.status(200).json({ message: 'Data received successfully' });
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
});

// Endpoint to send the latest data to the frontend (GET)
app.get('/api/latest', (req, res) => {
  res.status(200).json(latestData); // Send the latest data as JSON
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});