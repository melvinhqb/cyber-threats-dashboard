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

// Route pour bloquer une IP via n8n
app.post('/api/block-ip', async (req, res) => {
  const { ip, threatId } = req.body;

  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });
  }

  try {
    // URL du webhook n8n (à configurer dans les variables d'environnement)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/block-ip';

    // Appel du workflow n8n
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ip: ip,
        threatId: threatId,
        action: 'block',
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status}`);
    }

    const result = await response.json();

    // Log de l'action dans la base de données (optionnel)
    console.log(`IP ${ip} blocked via n8n workflow`);

    res.json({
      success: true,
      message: `IP ${ip} successfully blocked`,
      n8nResponse: result
    });

  } catch (error) {
    console.error('Error blocking IP:', error);
    res.status(500).json({
      error: 'Failed to block IP',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend démarré sur le port ${PORT}`);
});