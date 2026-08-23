import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BIRTHDAY_CONFIG, PHOTOS, SHYARI, SONG } from '../config/content';

export const useFirebaseData = () => {
  const [song, setSong] = useState(SONG);
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
            title: selectedSong.caption || SONG.title,
            subtitle: SONG.subtitle,
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
    fetchData();
  }, []);

  return {
    config: BIRTHDAY_CONFIG,
    photos: PHOTOS,
    shyari: SHYARI,
    song,
    loading,
    error,
    refetch: fetchData,
  };
};
