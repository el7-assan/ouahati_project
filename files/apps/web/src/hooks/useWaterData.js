import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

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
      
      // Fetch latest 7 days of data
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const records = await pb.collection('water_sensor_data').getList(1, 100, {
        sort: '-timestamp',
        filter: `timestamp >= "${sevenDaysAgo.toISOString()}"`,
        $autoCancel: false
      });

      if (records.items.length > 0) {
        setCurrentLevel(records.items[0].water_level);
        setStatus(records.items[0].sensor_status || 'connected');
        
        // Format for chart
        const formattedData = records.items.reverse().map(item => ({
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