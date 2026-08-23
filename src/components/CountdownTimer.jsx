import { useState, useEffect, useMemo } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CountdownTimer = ({
  name,
  birthMonth,
  birthDate,
  birthYear,
  targetYear,
  onCelebrate,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0,
  });

  const targetBirthday = useMemo(() => {
    const year = targetYear ?? new Date().getFullYear();
    return new Date(year, birthMonth - 1, birthDate, 0, 0, 0, 0);
  }, [birthMonth, birthDate, targetYear]);

  const ageTurning = targetBirthday.getFullYear() - birthYear;
  const targetLabel = `${birthDate} ${MONTH_NAMES[birthMonth - 1]} ${targetBirthday.getFullYear()}`;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetBirthday.getTime() - now;

      if (difference <= 0 && difference > -86400000) {
        onCelebrate();
        return;
      }

      const remaining = Math.max(0, difference);
      const totalSeconds = Math.floor(remaining / 1000);

      setTimeLeft({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        ms: Math.floor(remaining % 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 50);
    return () => clearInterval(timer);
  }, [targetBirthday, onCelebrate]);

  const pad = (num, length = 2) => String(num).padStart(length, '0');

  return (
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <h2 className="font-display" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', opacity: 0.8 }}>
        Counting down until
      </h2>
      <h1 className="font-display text-glow" style={{ fontSize: '3rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
        {name}&apos;s Birthday
      </h1>
      <p style={{ marginBottom: '0.75rem', fontSize: '1.1rem', opacity: 0.85 }}>
        {targetLabel}
      </p>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        Turning <span className="font-display text-coral" style={{ fontSize: '1.5rem' }}>{ageTurning}</span>
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: unit === 'ms' ? '85px' : '70px',
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
              height: '85px',
            }} className="font-display">
              <div className="animate-flicker" style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '20px',
                background: 'var(--glow-color)',
                borderRadius: '50% 50% 20% 20%',
                boxShadow: '0 0 10px var(--glow-color), 0 -5px 15px var(--coral-color)',
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
