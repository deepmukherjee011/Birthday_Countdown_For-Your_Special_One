import { useState } from 'react';
import Starfield from './components/Starfield';
import CountdownTimer from './components/CountdownTimer';
import Celebration from './components/Celebration';
import MemoryPolaroid from './components/MemoryPolaroid';
import AudioPlayer from './components/AudioPlayer';
import AdminPanel from './components/AdminPanel';
import { useFirebaseData } from './hooks/useFirebaseData';
import './index.css';

function App() {
  const { config, randomMemory, allSongs, loading, error, refetch } = useFirebaseData();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  if (loading) {
    return (
      <div className="container" style={{ justifyContent: 'center' }}>
        <Starfield />
        <p className="animate-flicker text-glow font-display" style={{ fontSize: '1.5rem' }}>Loading stars...</p>
      </div>
    );
  }

  if (error && error.includes("Firebase not configured")) {
    return (
      <div className="container" style={{ textAlign: 'center', zIndex: 20 }}>
        <Starfield />
        <h2 className="font-display text-glow" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome! ✨</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          To start the countdown, you need to connect your database so you can share the link with her.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', border: '1px solid var(--glow-color)' }}>
          <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Go to <a href="https://console.firebase.google.com/" target="_blank" style={{ color: 'var(--coral-color)' }}>Firebase Console</a> and create a free project.</li>
            <li>Enable <b>Firestore Database</b> and <b>Storage</b> (Test Mode).</li>
            <li>Copy your config keys into the <code>.env</code> file in this project folder.</li>
            <li>Restart this server (<code>npm run dev</code>).</li>
          </ol>
        </div>
      </div>
    );
  }

  // If no config exists in the database, force show the admin panel for initial setup
  const needsSetup = !config && !error;

  return (
    <>
      <Starfield />
      
      <div className="container">
        {error && <div style={{ color: 'var(--coral-color)', marginBottom: '1rem', zIndex: 20 }}>{error}</div>}

        {needsSetup ? (
          <AdminPanel onSetupComplete={refetch} hasConfig={false} />
        ) : config ? (
          <>
            {isCelebrating ? (
              <Celebration 
                name={config.name} 
                age={new Date().getFullYear() - config.birthYear} 
              />
            ) : (
              <CountdownTimer 
                name={config.name}
                birthMonth={config.birthMonth}
                birthDate={config.birthDate}
                birthYear={config.birthYear}
                onCelebrate={() => setIsCelebrating(true)}
              />
            )}
            
            <MemoryPolaroid memory={randomMemory} />
            <AudioPlayer songs={allSongs} />
          </>
        ) : null}
      </div>

      {/* Subtle Admin Toggle Button */}
      {!needsSetup && (
        <button 
          className="admin-toggle"
          onClick={() => setShowAdmin(!showAdmin)}
          aria-label="Admin settings"
        >
          ✎
        </button>
      )}

      {showAdmin && (
        <AdminPanel 
          hasConfig={true} 
          onClose={() => setShowAdmin(false)} 
          onSetupComplete={refetch} 
        />
      )}
    </>
  );
}

export default App;
