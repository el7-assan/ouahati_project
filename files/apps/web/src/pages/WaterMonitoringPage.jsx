import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Droplets, RefreshCw, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header.jsx';
import PumpControlSection from '@/components/PumpControlSection.jsx';
import { Button } from '@/components/ui/button';
import { useWaterData } from '@/hooks/useWaterData.js';

const WaterMonitoringPage = () => {
  const { data, currentLevel, status, loading, error, refetch } = useWaterData();

  const getStatusColor = (level) => {
    if (level >= 70) return 'text-green-500';
    if (level >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <>
      <Helmet>
        <title>مراقبة المياه - واحتي</title>
        <meta name="description" content="مراقبة مستوى المياه والتحكم في المضخات" />
      </Helmet>

      <div className="min-h-screen bg-[var(--cream)]">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-amiri text-[var(--green-deep)] mb-2">
                💧 مراقبة المياه الذكية
              </h1>
              <p className="font-cairo text-gray-600">
                مراقبة حية لمستوى الخزان والتحكم في المضخات
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-cairo text-sm ${
                status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {status === 'connected' ? 'المستشعر متصل' : 'المستشعر غير متصل'}
              </div>
              <Button 
                onClick={refetch} 
                disabled={loading}
                variant="outline" 
                className="font-cairo border-[var(--green-mid)] text-[var(--green-mid)]"
              >
                <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-center gap-3 font-cairo">
              <AlertTriangle className="w-5 h-5" />
              <p>خطأ في جلب البيانات: {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Current Level Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <h3 className="text-xl font-bold font-cairo text-gray-800 mb-6 z-10">مستوى الخزان الحالي</h3>
              
              <div className="relative w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center overflow-hidden z-10 bg-white">
                {/* Water fill animation */}
                <motion.div 
                  className="absolute bottom-0 w-full bg-blue-400 opacity-80"
                  initial={{ height: 0 }}
                  animate={{ height: `${currentLevel || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute top-0 w-[200%] h-4 bg-blue-300 rounded-full -ml-[50%] -mt-2 opacity-50"
                  />
                </motion.div>
                
                <div className="relative z-20 flex flex-col items-center">
                  <span className={`text-5xl font-bold font-cairo ${getStatusColor(currentLevel || 0)}`}>
                    {currentLevel !== null ? `${currentLevel}%` : '--'}
                  </span>
                  <Droplets className={`w-6 h-6 mt-2 ${getStatusColor(currentLevel || 0)}`} />
                </div>
              </div>
              
              {currentLevel < 30 && currentLevel !== null && (
                <p className="mt-6 text-red-500 font-cairo font-bold flex items-center gap-2 z-10">
                  <AlertTriangle className="w-5 h-5" />
                  مستوى المياه منخفض جداً!
                </p>
              )}
            </motion.div>

            {/* History Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
            >
              <h3 className="text-xl font-bold font-cairo text-gray-800 mb-6">سجل مستوى المياه (7 أيام)</h3>
              <div className="h-64 w-full" dir="ltr">
                {loading && data.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="font-cairo text-gray-500">جاري تحميل البيانات...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontFamily: 'Cairo', fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis domain={[0, 100]} tick={{ fontFamily: 'Cairo', fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ fontFamily: 'Cairo', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value}%`, 'المستوى']}
                        labelFormatter={(label) => `التاريخ: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="level" 
                        stroke="var(--green-mid)" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: "var(--green-mid)", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "var(--gold)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </div>

          {/* Pump Control Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PumpControlSection currentWaterLevel={currentLevel || 0} />
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default WaterMonitoringPage;