import { useMemo, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getDailyContent, getLocalDateKey } from '../config/content';

export const useFirebaseData = () => {
  const [minuteTick, setMinuteTick] = useState(() => Date.now());
  const tickDate = useMemo(() => new Date(minuteTick), [minuteTick]);
  const todayKey = useMemo(() => getLocalDateKey(tickDate), [tickDate]);
  const localContent = useMemo(() => getDailyContent(tickDate), [tickDate]);
  const [song, setSong] = useState(localContent.song);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Firebase connection timed out. Using local content.')),
          5000
        );
      });

      const fetchPromise = async () => {
        const memoriesSnapshot = await getDocs(collection(db, 'memories'));
        const fetchedSongs = [];

        memoriesSnapshot.forEach((docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          if (data.type === 'audio') {
            fetchedSongs.push(data);
          }
        });

        if (fetchedSongs.length > 0) {
          const selectedSong = fetchedSongs[0];
          setSong({
            src: selectedSong.url,
            title: selectedSong.caption || localContent.song.title,
            subtitle: localContent.song.subtitle,
          });
        }
      };

      await Promise.race([fetchPromise(), timeoutPromise]);
    } catch (err) {
      console.warn(err.message);
      if (err.message.includes('Firebase not configured')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSong(localContent.song);
  }, [localContent.song]);

  useEffect(() => {
    const refreshDate = () => setMinuteTick(Date.now());
    const timer = setInterval(refreshDate, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, [todayKey]);

  return {
    config: localContent.config,
    photos: localContent.photos,
    shyari: localContent.shyari,
    song,
    background: localContent.background,
    surpriseDate: localContent.surpriseDate,
    loading,
    error,
    refetch: fetchData,
  };
};
