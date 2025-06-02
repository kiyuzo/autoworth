// autoworth-api/server.js
const express = require('express');
const cors = require('cors');
const { PythonShell } = require('python-shell');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/predict', async (req, res) => {
  try {
    const { brand, model, trim, year, mileage } = req.body;
    
    const options = {
      mode: 'text',
      pythonOptions: ['-u'],
      scriptPath: './python/',
      args: [brand, model, trim, year, mileage]
    };

    PythonShell.run('predict.py', options, (err, results) => {
      if (err) throw err;
      res.json({ price: parseFloat(results[0]) });
    });
  } catch (error) {
    res.status(500).json({ error: 'Prediction failed' });
  }
});

app.listen(5000, () => console.log('API running on port 5000'));