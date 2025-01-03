const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg'); // Import PostgreSQL client

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://piezodatabase_c43t_user:NN2TuZhn6dqpmItafH7fWBGNwex5cXMb@dpg-ctn60p3v2p9s73fgtgt0-a.singapore-postgres.render.com/piezodatabase_c43t',
  ssl: { rejectUnauthorized: false }, // Necessary for some cloud-hosted databases
});

// Serve frontend from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Store data from ESP32 (POST)
app.post('/api/update', async (req, res) => {
  const { voltage, current } = req.body;

  if (typeof voltage === 'number' && typeof current === 'number') {
    try {
      // Insert data into PostgreSQL
      await pool.query('INSERT INTO sensor_data (voltage, current) VALUES ($1, $2)', [voltage, current]);
      console.log(`Data saved: Voltage = ${voltage}, Current = ${current}`);
      res.status(200).json({ message: 'Data saved successfully' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
});

// Fetch all historical data (GET)
app.get('/api/sensor-data', async (req, res) => {
  try {
    const result = await pool.query('SELECT voltage, current, timestamp FROM sensor_data ORDER BY timestamp DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// Fetch the latest data (GET)
app.get('/api/latest', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1');
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'No data found' });
      }
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
