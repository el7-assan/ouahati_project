import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, Clock, TrendingDown, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SmartWateringSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [waterLevel, setWaterLevel] = useState(75);
  const [isDrought, setIsDrought] = useState(false);
  const selectedCity = localStorage.getItem('selectedCity') || 'الرشيدية';

  useEffect(() => {
    const stored = localStorage.getItem('wateringPreferences');
    if (stored) {
      try {
        const prefs = JSON.parse(stored);
        setWaterLevel(prefs.waterLevel || 75);
      } catch (error) {
        console.error('Error loading watering preferences:', error);
      }
    }
  }, []);

  useEffect(() => {
    setIsDrought(waterLevel < 30);
    localStorage.setItem(
      'wateringPreferences',
      JSON.stringify({ waterLevel, lastUpdated: new Date().toISOString() })
    );
    
    // Simulate SMS alert
    if (waterLevel < 30) {
      toast({
        title: '📱 تم إرسال رسالة نصية (SMS)',
        description: 'تنبيه: مستوى المياه منخفض جداً في الخزان الرئيسي',
        variant: 'destructive'
      });
    }
  }, [waterLevel, toast]);

  const getTankStatus = () => {
    if (waterLevel >= 70) return { text: 'ممتلئ', color: 'text-green-600' };
    if (waterLevel >= 40) return { text: 'متوسط', color: 'text-yellow-600' };
    return { text: 'منخفض', color: 'text-red-600' };
  };

  const wateringSchedule = [
    { time: '6:00 صباحاً', crop: '🥕 جزر', amount: '5 لتر/م²', priority: 'عالية' },
    { time: '7:00 صباحاً', crop: '🧅 بصل', amount: '4 لتر/م²', priority: 'متوسطة' },
    { time: '6:30 مساءً', crop: '🍅 طماطم', amount: '6 لتر/م²', priority: 'عالية' },
    { time: '7:30 مساءً', crop: '🧄 ثوم', amount: '3 لتر/م²', priority: 'منخفضة' },
  ];

  const status = getTankStatus();

  return (
    <section id="watering" className="py-12 bg-gradient-to-b from-[var(--sand)] to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-amiri text-[var(--green-deep)] mb-3">
            💧 نظام الري الذكي
          </h2>
          <p className="text-lg font-cairo text-gray-600 mb-6">
            إدارة مياه الري بذكاء لمحاصيل أفضل
          </p>
          
          <Button 
            onClick={() => navigate('/water-monitoring')}
            className="bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Droplets className="ml-2 h-6 w-6" />
            لوحة مراقبة المياه والتحكم في المضخات
            <ArrowLeft className="mr-2 h-5 w-5" />
          </Button>
        </motion.div>

        {isDrought && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-cairo font-bold text-red-700 text-lg mb-1">
                  ⚠️ تحذير: جفاف شديد! (تم إرسال SMS)
                </h3>
                <p className="font-cairo text-red-600">
                  مستوى المياه منخفض جداً. يرجى إعادة ملء الخزان فوراً لتجنب تلف المحاصيل.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Water Level Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)]">
                محاكاة مستوى المياه
              </h3>
              <span className={`text-lg font-bold font-cairo ${status.color}`}>
                {status.text}
              </span>
            </div>

            {/* Animated Water Bar */}
            <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${waterLevel}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`absolute bottom-0 w-full ${
                  isDrought
                    ? 'bg-gradient-to-t from-red-400 to-red-300'
                    : 'bg-gradient-to-t from-blue-500 to-blue-300'
                }`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-0 w-full h-8 bg-white/20"
                  style={{
                    borderRadius: '50% 50% 0 0',
                  }}
                />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-white drop-shadow-lg">
                  {waterLevel}%
                </span>
              </div>
            </div>

            <Slider
              value={[waterLevel]}
              onValueChange={(value) => setWaterLevel(value[0])}
              max={100}
              step={1}
              className="mb-4"
            />

            <Button
              onClick={() => {
                setWaterLevel(100);
                toast({
                  title: '✅ تم إعادة ملء الخزان',
                  description: 'مستوى المياه الآن 100%',
                });
              }}
              className="w-full bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
            >
              <Droplets className="ml-2 h-5 w-5" />
              إعادة ملء الخزان (محاكاة)
            </Button>
          </motion.div>

          {/* Daily Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)] mb-4">
              تنبيهات الري اليومية
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-cairo font-bold text-blue-700">
                    الري اليوم الساعة 6 صباحاً
                  </p>
                  <p className="text-sm font-cairo text-blue-600">
                    محاصيل الجزر والبصل
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <TrendingDown className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-cairo font-bold text-orange-700">
                    توقعات: انخفاض في درجات الحرارة
                  </p>
                  <p className="text-sm font-cairo text-orange-600">
                    قلل كمية الري بنسبة 20%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Droplets className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-cairo font-bold text-green-700">
                    الري المسائي الساعة 6:30 مساءً
                  </p>
                  <p className="text-sm font-cairo text-green-600">
                    محاصيل الطماطم والفلفل
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--sand)] p-4 rounded-lg">
              <p className="font-cairo text-sm text-gray-700">
                <span className="font-bold">💡 نصيحة:</span> أفضل أوقات الري في {selectedCity} هي
                الصباح الباكر (5-7 صباحاً) والمساء (6-8 مساءً) لتقليل التبخر.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Watering Schedule Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)] mb-4">
            جدول الري الموصى به - {selectedCity}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--green-pale)]">
                  <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                    الوقت
                  </th>
                  <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                    المحصول
                  </th>
                  <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                    كمية المياه
                  </th>
                  <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                    الأولوية
                  </th>
                </tr>
              </thead>
              <tbody>
                {wateringSchedule.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-cairo">{item.time}</td>
                    <td className="px-4 py-3 font-cairo">{item.crop}</td>
                    <td className="px-4 py-3 font-cairo">{item.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-cairo ${
                          item.priority === 'عالية'
                            ? 'bg-red-100 text-red-700'
                            : item.priority === 'متوسطة'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SmartWateringSection;