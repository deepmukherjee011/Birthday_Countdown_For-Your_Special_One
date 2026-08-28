import { useState, useCallback } from 'react';
import Starfield from './components/Starfield';
import CountdownTimer from './components/CountdownTimer';
import Celebration from './components/Celebration';
import PhotoGallery from './components/PhotoGallery';
import ShayariCard from './components/ShayariCard';
import AudioPlayer from './components/AudioPlayer';
import AdminPanel from './components/AdminPanel';
import MiniGame from './components/BalloonMessages';
import HappyBirthdayGame from './components/HappyBirthdayGame';
import { useFirebaseData } from './hooks/useFirebaseData';
import './index.css';

function App() {
  const { config, photos, shyari, song, background, loading, error, refetch, surpriseDate } = useFirebaseData();
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(true);
  const handleCelebrate = useCallback(() => setIsCelebrating(true), []);
  const celebrationAge = config.targetYear
    ? config.targetYear - config.birthYear
    : new Date().getFullYear() - config.birthYear;
  const backgroundStyle = background?.src
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(5, 8, 20, 0.62) 0%, rgba(21, 15, 46, 0.72) 48%, rgba(5, 8, 20, 0.88) 100%), url("${background.src}")`,
        backgroundPosition: background.position || 'center bottom',
      }
    : undefined;

  if (loading) {
    return (
      <>
        <div className="site-background" style={backgroundStyle} aria-hidden="true" />
        <Starfield />
        <div className="container loading-screen">
          <p className="animate-flicker text-glow font-display loading-text">
            Loading your surprise...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="site-background" style={backgroundStyle} aria-hidden="true" />
      <Starfield />
      {showMiniGame ? (
        surpriseDate === '2026-08-29' ? (
          <HappyBirthdayGame
            shyari={shyari}
            song={song}
            photos={photos}
            onFinish={() => setShowMiniGame(false)}
          />
        ) : (
          <MiniGame
            shyari={shyari}
            song={song}
            photos={photos}
            onFinish={() => setShowMiniGame(false)}
          />
        )
      ) : (
        <div className="container">
          {error && (
            <div className="app-error">{error}</div>
          )}

          {isCelebrating ? (
            <Celebration
              name={config.name}
              age={celebrationAge}
            />
          ) : (
            <CountdownTimer
              name={config.name}
              birthMonth={config.birthMonth}
              birthDate={config.birthDate}
              birthYear={config.birthYear}
              targetYear={config.targetYear}
              onCelebrate={handleCelebrate}
            />
          )}

          <ShayariCard title={shyari.title} lines={shyari.lines} />
          <PhotoGallery photos={photos} />
          <AudioPlayer song={song} autoplay />
        </div>
      )}

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
