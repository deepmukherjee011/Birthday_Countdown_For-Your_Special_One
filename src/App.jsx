import { useState } from 'react';
import Starfield from './components/Starfield';
import CountdownTimer from './components/CountdownTimer';
import Celebration from './components/Celebration';
import PhotoGallery from './components/PhotoGallery';
import ShayariCard from './components/ShayariCard';
import AudioPlayer from './components/AudioPlayer';
import AdminPanel from './components/AdminPanel';
import { useFirebaseData } from './hooks/useFirebaseData';
import './index.css';

function App() {
  const { config, photos, shyari, song, loading, error, refetch } = useFirebaseData();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  if (loading) {
    return (
      <div className="container loading-screen">
        <Starfield />
        <p className="animate-flicker text-glow font-display loading-text">
          Loading your surprise...
        </p>
      </div>
    );
  }

  return (
    <>
      <Starfield />

      <div className="container">
        {error && (
          <div className="app-error">{error}</div>
        )}

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

        <PhotoGallery photos={photos} />
        <ShayariCard title={shyari.title} lines={shyari.lines} />
        <AudioPlayer song={song} autoplay />
      </div>

      <button
        type="button"
        className="admin-toggle"
        onClick={() => setShowAdmin(!showAdmin)}
        aria-label="Admin settings"
      >
        ✎
      </button>

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
