import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const usePumpLogs = (refreshInterval = 60000) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const records = await pb.collection('pump_logs').getList(1, 50, {
        sort: '-timestamp',
        $autoCancel: false
      });

      setLogs(records.items);
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