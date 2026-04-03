import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;