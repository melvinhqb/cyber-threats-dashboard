const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Route pour récupérer les cyber_threats
app.get('/api/threats', (req, res) => {
  const query = 'SELECT * FROM cyber_threats ORDER BY last_seen DESC';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Erreur MySQL:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données.' });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend démarré sur le port ${PORT}`);
});