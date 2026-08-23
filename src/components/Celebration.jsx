import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Celebration = ({ name, age }) => {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', zIndex: 10, animation: 'fadeIn 2s ease-in' }}>
      <h1 className="font-display text-glow animate-float" style={{ fontSize: '4rem', fontStyle: 'italic', marginBottom: '1rem' }}>
        Happy Birthday,<br/>{name}!
      </h1>
      <p style={{ fontSize: '1.5rem', color: 'var(--coral-color)' }}>
        Wishing you the best year yet at {age}.
      </p>
    </div>
  );
};

export default Celebration;
