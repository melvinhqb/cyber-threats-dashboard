# Cyber Threats Dashboard

Dashboard de surveillance des menaces cybernétiques avec interface React et API Node.js.

## 🚀 Installation et Configuration

### Prérequis

- Docker et Docker Compose

### Configuration des variables d'environnement

1. **Créer le fichier `.env`** à la racine du projet :
   ```bash
   cp .env.example .env  # Si .env.example existe, sinon créer manuellement
   ```

2. **Remplir les variables d'environnement** dans le fichier `.env` :

| Variable | Description |
|----------|-------------|
| `DB_HOST` | Adresse IP du serveur MySQL |
| `DB_USER` | Nom d'utilisateur MySQL |
| `DB_PASSWORD` | Mot de passe MySQL |
| `DB_NAME` | Nom de la base de données |
| `PORT` | Port du serveur backend |

### Configuration de la base de données

Le projet nécessite un serveur MySQL/MariaDB avec une base de données et une table `cyber_threats`.

**Script SQL pour créer la table :**

```sql
-- Créer la base de données (adaptez le nom selon votre configuration)
CREATE DATABASE IF NOT EXISTS votre_base_de_donnees;
USE votre_base_de_donnees;

-- Créer la table cyber_threats
CREATE TABLE IF NOT EXISTS cyber_threats (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    attacker_ip VARCHAR(50) NOT NULL,
    target_ip VARCHAR(50) DEFAULT 'unknown',
    attack_type VARCHAR(255) NOT NULL,
    tech_analysis TEXT,
    exec_summary TEXT,
    remediation TEXT,
    occurrences INT(11) DEFAULT 1,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_attacker_ip (attacker_ip),
    INDEX idx_attack_type (attack_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Description des colonnes :**
- `id` : Identifiant unique auto-incrémenté
- `attacker_ip` : Adresse IP de l'attaquant
- `target_ip` : Adresse IP cible (défaut: 'unknown')
- `attack_type` : Type d'attaque
- `tech_analysis` : Analyse technique (optionnel)
- `exec_summary` : Résumé exécutif (optionnel)
- `remediation` : Actions de remédiation (optionnel)
- `occurrences` : Nombre d'occurrences (défaut: 1)
- `first_seen` : Première apparition (timestamp automatique)
- `last_seen` : Dernière apparition (mise à jour automatique)

## 🏃‍♂️ Lancement du projet

### Avec Docker Compose (recommandé)

```bash
# Construire et lancer les services
docker compose up --build

# Ou en arrière-plan
docker compose up -d --build
```

### Accès aux services

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001

### Arrêter les services

```bash
docker compose down
```

## 📁 Structure du projet

```
├── backend/           # API Node.js
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/          # Interface React/Vite
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
├── docker-compose.yml # Configuration Docker
├── .env              # Variables d'environnement (non commité)
└── .gitignore        # Fichiers ignorés par Git
```

## 🔧 Développement

### Backend uniquement

```bash
cd backend
npm install
npm start
```

### Frontend uniquement

```bash
cd frontend
npm install
npm run dev -- --host
```

## 🐳 Services Docker

- **backend** : API Node.js sur le port 3001
- **frontend** : Application React/Vite sur le port 5173