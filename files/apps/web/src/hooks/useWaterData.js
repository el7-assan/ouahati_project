import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit
} from 'firebase/firestore';

export const useWaterData = (refreshInterval = 300000) => {
  const [data, setData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        collection(db, 'water_sensor_data'),
        where('timestamp', '>=', sevenDaysAgo.toISOString()),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCurrentLevel(items[0].water_level);
        setStatus(items[0].sensor_status || 'connected');

        const formattedData = [...items].reverse().map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(item.timestamp).toLocaleDateString('ar-MA', { month: 'short', day: 'numeric' }),
          level: item.water_level
        }));
        setData(formattedData);
      } else {
        setStatus('disconnected');
      }
    } catch (err) {
      console.error('Error fetching water data:', err);
      setError(err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, currentLevel, status, loading, error, refetch: fetchData };
};