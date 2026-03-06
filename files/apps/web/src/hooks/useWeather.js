import { useState, useEffect } from 'react';
import { DEFAULT_CITY } from '@/constants/cities';

export default function useWeather(selectedCity = DEFAULT_CITY) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Africa%2FCasablanca`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('مشكلة في جلب الطقس');

        const data = await res.json();
        const current = data.current;

        setWeather({
          temperature: Math.round(current.temperature_2m),
          feelsLike: Math.round(current.apparent_temperature),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          precipitation: current.precipitation,
          condition: getCondition(current.weather_code),
          cityName: selectedCity.name,
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'خطأ في الاتصال');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // تحديث كل 30 دقيقة
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  return { weather, loading, error };
}

function getCondition(code) {
  if (code === 0) return 'سماء صافية ☀️';
  if ([1, 2, 3].includes(code)) return 'غائم جزئياً ☁️';
  if (code >= 45 && code <= 48) return 'ضباب 🌫️';
  if (code >= 51 && code <= 67) return 'مطر خفيف إلى متوسط 🌧️';
  if (code >= 71 && code <= 77) return 'ثلج خفيف ❄️';
  if (code >= 80 && code <= 86) return 'زخات مطر 🌦️';
  if (code >= 95) return 'عاصفة رعدية ⛈️';
  return 'غير معروف';
}