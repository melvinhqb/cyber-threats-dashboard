import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockingIPs, setBlockingIPs] = useState(new Set());

  useEffect(() => {
    // Appel à notre API Node.js
    fetch('/api/threats')
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        setThreats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleBlockIP = async (attackerIP, threatId) => {
    if (blockingIPs.has(threatId)) return; // Évite les clics multiples

    setBlockingIPs(prev => new Set(prev).add(threatId));

    try {
      // Appel au workflow n8n pour bloquer l'IP
      const response = await fetch('/api/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip: attackerIP,
          threatId: threatId
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du blocage de l\'IP');
      }

      const result = await response.json();
      alert(`IP ${attackerIP} bloquée avec succès !`);
    } catch (err) {
      alert(`Erreur lors du blocage de l'IP ${attackerIP}: ${err.message}`);
    } finally {
      setBlockingIPs(prev => {
        const newSet = new Set(prev);
        newSet.delete(threatId);
        return newSet;
      });
    }
  };

  if (loading) return <div className="container"><p>Chargement des données...</p></div>;
  if (error) return <div className="container"><p className="error">Erreur: {error}</p></div>;

  return (
    <div className="container">
      <h1>Dashboard : Cyber Threats</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>IP Source</th>
              <th>IP Cible</th>
              <th>Type d'attaque</th>
              <th>Occurrences</th>
              <th>Première apparition</th>
              <th>Dernière apparition</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {threats.map((threat) => (
              <tr key={threat.id}>
                <td>{threat.id}</td>
                <td><span className="ip-badge">{threat.attacker_ip}</span></td>
                <td>{threat.target_ip || 'Inconnue'}</td>
                <td>{threat.attack_type}</td>
                <td>{threat.occurrences}</td>
                <td>{new Date(threat.first_seen).toLocaleString()}</td>
                <td>{new Date(threat.last_seen).toLocaleString()}</td>
                <td>
                  <button
                    className={`block-btn ${blockingIPs.has(threat.id) ? 'blocking' : ''}`}
                    onClick={() => handleBlockIP(threat.attacker_ip, threat.id)}
                    disabled={blockingIPs.has(threat.id)}
                  >
                    {blockingIPs.has(threat.id) ? 'Blocage...' : 'Bloquer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;