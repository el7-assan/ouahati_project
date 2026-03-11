import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

export const usePumpLogs = (refreshInterval = 60000) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, 'pump_logs'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching pump logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchLogs, refreshInterval]);

  return { logs, loading, error, refetch: fetchLogs };
};