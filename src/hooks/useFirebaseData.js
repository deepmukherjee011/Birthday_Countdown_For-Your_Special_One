import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useFirebaseData = () => {
  const [config, setConfig] = useState(null);
  
  // Store all fetched data to rotate without hitting DB
  const [allMemories, setAllMemories] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  
  const [randomMemory, setRandomMemory] = useState(null);
  const [randomSong, setRandomSong] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!db) {
      setError("Firebase not configured");
      setLoading(false);
      return;
    }

    try {
      // Create a timeout promise to prevent infinite hanging if DB doesn't exist
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timeout. Did you click 'Create database' for Firestore in the Firebase Console?")), 8000);
      });

      // Wrap the actual fetching in a promise
      const fetchPromise = async () => {
        // 1. Use Static Config for Priya
      setConfig({
        name: "Priya",
        birthMonth: 8,
        birthDate: 29,
        birthYear: 2000
      });

      // 2. Fetch Memories
      const memoriesSnapshot = await getDocs(collection(db, 'memories'));
        const fetchedMemories = [];
        const fetchedSongs = [];

        memoriesSnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          if (data.type === 'audio') {
            fetchedSongs.push(data);
          } else {
            fetchedMemories.push(data);
          }
        });
        
        setAllMemories(fetchedMemories);
        setAllSongs(fetchedSongs);

        // Initial Random Selection
        if (fetchedMemories.length > 0) {
          setRandomMemory(fetchedMemories[Math.floor(Math.random() * fetchedMemories.length)]);
        }
        if (fetchedSongs.length > 0) {
          setRandomSong(fetchedSongs[Math.floor(Math.random() * fetchedSongs.length)]);
        }
      };

      // Race the fetch against the 8 second timeout
      await Promise.race([fetchPromise(), timeoutPromise]);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set up interval to rotate memories every minute (60,000 ms)
  useEffect(() => {
    if (allMemories.length === 0) return;

    const interval = setInterval(() => {
      setRandomMemory(allMemories[Math.floor(Math.random() * allMemories.length)]);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [allMemories]);

  return { config, randomMemory, allSongs, loading, error, refetch: fetchData };
};
