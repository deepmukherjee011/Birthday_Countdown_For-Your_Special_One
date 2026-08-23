import { useState, useEffect } from 'react';

const CountdownTimer = ({ name, birthMonth, birthDate, birthYear, onCelebrate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0
  });
  const [ageTurning, setAgeTurning] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Month is 0-indexed in Date constructor (0 = Jan, 11 = Dec)
      let nextBirthday = new Date(now.getFullYear(), birthMonth - 1, birthDate);

      if (now > nextBirthday) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }

      const difference = nextBirthday.getTime() - now.getTime();
      const nextAge = nextBirthday.getFullYear() - birthYear;
      setAgeTurning(nextAge);

      if (difference <= 0 && difference > -86400000) {
        // It's the birthday! (allow celebration for 24h)
        onCelebrate();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        ms: Math.floor(difference % 1000)
      });
    };

    calculateTimeLeft(); // Initial calc
    // Run frequently to update milliseconds smoothly
    const timer = setInterval(calculateTimeLeft, 50);
    return () => clearInterval(timer);
  }, [birthMonth, birthDate, birthYear, onCelebrate]);

  const pad = (num, length = 2) => String(num).padStart(length, '0');

  return (
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.8 }}>
        Counting down until
      </h2>
      <h1 className="font-display text-glow" style={{ fontSize: '3rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
        {name}'s Birthday
      </h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        Turning <span className="font-display text-coral" style={{ fontSize: '1.5rem' }}>{ageTurning}</span>
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: unit === 'ms' ? '85px' : '70px'
          }}>
            <div style={{
              position: 'relative',
              fontSize: unit === 'ms' ? '2rem' : '2.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1rem',
              borderRadius: '12px',
              borderTop: '2px solid var(--glow-color)',
              marginBottom: '0.5rem',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '85px'
            }} className="font-display">
              {/* CSS Flame */}
              <div className="animate-flicker" style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '20px',
                background: 'var(--glow-color)',
                borderRadius: '50% 50% 20% 20%',
                boxShadow: '0 0 10px var(--glow-color), 0 -5px 15px var(--coral-color)'
              }} />
              {unit === 'ms' ? pad(value, 3) : pad(value, 2)}
            </div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7 }}>
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
