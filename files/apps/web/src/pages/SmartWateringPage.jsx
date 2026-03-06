import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '@/components/Header.jsx';

const SmartWateringPage = () => {
  // بيانات وهمية للتجربة
  const [currentMoisture, setCurrentMoisture] = useState(65);
  const [moistureHistory, setMoistureHistory] = useState([
    { time: '09:00', moisture: 72 },
    { time: '10:00', moisture: 68 },
    { time: '11:00', moisture: 65 },
    { time: '12:00', moisture: 62 },
    { time: '13:00', moisture: 58 },
    { time: '14:00', moisture: currentMoisture },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.max(10, Math.min(100, currentMoisture + Math.floor(Math.random() * 11 - 5)));
      setCurrentMoisture(newValue);

      setMoistureHistory(prev => {
        const newHistory = [...prev.slice(-5), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          moisture: newValue
        }];
        return newHistory;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [currentMoisture]);

  const getMoistureStatus = (value) => {
    if (value >= 60) {
      return {
        text: 'رطبة – حالة ممتازة',
        message: 'لا حاجة للري الآن، التربة في أفضل حالاتها',
        color: 'text-blue-600',
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        border: 'border-blue-300',
        icon: CheckCircle2,
        alert: false
      };
    }
    if (value >= 40) {
      return {
        text: 'متوسطة الرطوبة – راقب',
        message: 'التربة بدأت تجف قليلاً، يُفضل المتابعة',
        color: 'text-yellow-600',
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        border: 'border-yellow-300',
        icon: AlertTriangle,
        alert: false
      };
    }
    return {
      text: 'جافة – ضرورة الري الآن',
      message: 'التربة جافة جدًا – سيتم الري تلقائيًا خلال الدقائق القادمة',
      color: 'text-red-600',
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      border: 'border-red-300',
      icon: AlertTriangle,
      alert: true
    };
  };

  const status = getMoistureStatus(currentMoisture);

  return (
    <>
      <Helmet>
        <title>بيانات رطوبة التربة - واحتي</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[var(--cream)] to-white">
        <Header />

        <main className="container mx-auto px-4 py-12 max-w-5xl">
          {/* العنوان */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-extrabold font-amiri text-gray-800 tracking-tight">
              بيانات رطوبة التربة
            </h1>
            <p className="mt-4 text-xl font-cairo text-gray-600">
              Soil Sensor Data – مراقبة دقيقة في الوقت الحقيقي
            </p>
          </motion.div>

          {/* الدائرة الخارجية الكبيرة (خاوية في الوسط) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mx-auto mb-16 w-80 h-80 md:w-[420px] md:h-[420px]"
          >
            {/* الخلفية الخارجية الدائرية (خاوية تمامًا في الوسط) */}
            <div className="absolute inset-0 rounded-full border-[16px] border-gray-100 shadow-2xl" />

            {/* الدائرة المتدرجة (التقدم) – لون أزرق فاتح إلى غامق */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                background: `conic-gradient(
                  from 0deg at 50% 50%,
                  #60a5fa 0deg,
                  #3b82f6 ${currentMoisture * 3.6}deg,
                  #1e40af ${currentMoisture * 3.6}deg,
                  transparent ${currentMoisture * 3.6}deg
                )`,
                clipPath: 'circle(50% at 50% 50%)'
              }}
            />

            {/* المحتوى الداخلي (خالي تمامًا من الخلفية الداخلية) */}
            <div className="absolute inset-8 rounded-full bg-white shadow-inner flex flex-col items-center justify-center">
              <Droplets className="w-20 h-20 md:w-24 md:h-24 text-blue-600 mb-4" />
              <div className="text-8xl md:text-[140px] font-extrabold text-gray-900 leading-none">
                {currentMoisture}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-600 mt-2">%</div>
            </div>
          </motion.div>

          {/* حالة الرطوبة + تنبيهات */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className={`inline-block px-10 py-6 rounded-3xl text-3xl md:text-4xl font-bold font-cairo ${status.color}`}>
              {status.text}
            </div>

            <p className="mt-6 text-xl md:text-2xl font-cairo text-gray-800 max-w-3xl mx-auto leading-relaxed">
              {status.message}
            </p>

            {status.alert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 p-8 bg-red-50 rounded-2xl border-2 border-red-200 shadow-lg max-w-2xl mx-auto"
              >
                <p className="text-2xl font-bold text-red-700 mb-4">
                  سيتم الري تلقائيًا الآن
                </p>
                <p className="text-lg text-red-800">
                  النظام يقوم تلقائيًا بتشغيل الري لاستعادة الرطوبة المثالية
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* الرسم البياني */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100"
          >
            <h3 className="text-3xl font-bold font-amiri text-gray-800 mb-10 text-center">
              تطور رطوبة التربة خلال الساعات الأخيرة
            </h3>

            <div className="h-[500px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moistureHistory} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="moistureBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 14 }} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" tick={{ fontSize: 14 }} label={{ value: '% رطوبة', angle: -90, position: 'insideLeft', offset: -15, fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{
                      fontFamily: 'Cairo',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      padding: '16px'
                    }}
                    formatter={(value) => [`${value}%`, 'الرطوبة']}
                    labelFormatter={(label) => `الوقت: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="moisture" 
                    stroke="url(#moistureBlue)" 
                    strokeWidth={5}
                    dot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3 }}
                    activeDot={{ r: 12, fill: "#1e40af", stroke: "#fff", strokeWidth: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default SmartWateringPage;