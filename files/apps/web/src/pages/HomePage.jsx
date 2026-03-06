import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Droplets, ThermometerSun, Calendar as CalendarIcon, Sprout, Ruler, Info } from 'lucide-react';
import Header from '@/components/Header.jsx';
import { cropsData } from '@/data/cropsData.js';
import useWeather from '@/hooks/useWeather';
import { CITIES, DEFAULT_CITY } from '@/constants/cities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const HomePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);


  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];

  const currentCrops = cropsData.filter(crop => crop.months.includes(selectedMonth));

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };
  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    if (saved) {
       try {
           const cityObj = JSON.parse(saved);
           
           const matched = CITIES.find(c => c.name === cityObj.name);
           if (matched) {
              setSelectedCity(matched);
           } else {
              
              setSelectedCity(DEFAULT_CITY);
           }
       } catch (e) {
           console.error('خطأ في قراءة المدينة المحفوظة', e);
           setSelectedCity(DEFAULT_CITY);
       }
    }}, []);

  const { weather, loading, error } = useWeather(selectedCity);

  return (
    <>
      <Helmet>
        <title>واحتي - التقويم الزراعي للواحات المغربية</title>

        <meta name="description" content="التقويم الزراعي الذكي للواحات المغربية. اكتشف أفضل أوقات الزراعة والمحاصيل المناسبة." />
      </Helmet>

      <div className="min-h-screen bg-[var(--cream)] pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white rounded-xl shadow-md p-6 border border-[var(--sand)]">
                   <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)] mb-4 text-center">
                            حالة الطقس في {selectedCity.name || 'منطقتك'}
                   </h3>

                   {loading && <p className="text-center text-[var(--green-mid)]">جاري تحميل الطقس...</p>}
                   {error && <p className="text-center text-red-600">خطأ: {error}</p>}

                   {weather && (
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                                      <div>
                                                <p className="text-4xl font-bold text-[var(--green-deep)]">{weather.temperature}°C</p>
                                                <p className="text-sm text-gray-600">درجة الحرارة</p>
                                      </div>
                                      <div>
                                                <p className="text-3xl font-bold text-[var(--green-mid)]">{weather.feelsLike}°C</p>
                                                <p className="text-sm text-gray-600">الشعور بها</p>
                                      </div>
                                      <div>
                                                <p className="text-3xl font-bold text-blue-600">{weather.humidity}%</p>
                                                <p className="text-sm text-gray-600">الرطوبة</p>
                                      </div>
                                      <div>
                                                <p className="text-3xl font-bold text-orange-600">{weather.windSpeed} م/ث</p>
                                                <p className="text-sm text-gray-600">الرياح</p>
                                      </div>
                                      <div className="col-span-2 sm:col-span-4 mt-4">
                                                <p className="text-xl font-bold text-[var(--green-deep)]">{weather.condition}</p>
                                                {weather.precipitation > 0 && (
                                                         <p className="text-sm text-blue-600 mt-1">هطول: {weather.precipitation} مم</p>
                                                )}
                                      </div>
                             </div>
                   )}
          </motion.div>
        </div>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--green-deep)] via-[var(--green-mid)] to-[var(--green-light)] py-12 md:py-20">

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-10 left-10 w-80 h-80 md:w-[500px] md:h-[500px] bg-white rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold font-amiri text-white mb-4">
                التقويم الزراعي الذكي
              </h1>
              <p className="text-lg md:text-2xl font-cairo text-white/90 max-w-2xl mx-auto">
                دليلك الشامل لزراعة المحاصيل في الواحات المغربية حسب فصول السنة
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            
            {/* Month Selector */}
            <div className="mb-8 overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex gap-2 md:gap-3 min-w-max px-2">
                {months.map((month, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMonth(index)}
                    className={`px-5 py-2 md:px-6 md:py-3 rounded-xl font-cairo font-bold transition-all text-sm md:text-base ${
                      selectedMonth === index
                        ? 'bg-[var(--green-mid)] text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {month}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold font-cairo text-[var(--green-deep)]">
                المحاصيل المناسبة لشهر {months[selectedMonth]}
              </h2>
              <span className="bg-[var(--green-pale)] text-[var(--green-deep)] px-3 py-1 rounded-full text-sm font-cairo font-bold">
                {currentCrops.length} محصول
              </span>
            </div>

            {/* Crop Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
              {currentCrops.map((crop, index) => (
                <motion.div
                  key={crop.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCropClick(crop)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 cursor-pointer transition-all hover:-translate-y-1 flex flex-col items-center text-center"
                >
                  <span className="text-5xl md:text-7xl mb-3 drop-shadow-sm">{crop.emoji}</span>
                  <h3 className="text-lg md:text-xl font-bold font-cairo text-gray-800 mb-1">
                    {crop.nameAr}
                  </h3>
                  <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 font-cairo mt-auto pt-2">
                    <CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{crop.growthDays} يوم للحصاد</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {currentCrops.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-cairo text-gray-500 text-lg">لا توجد محاصيل مسجلة للزراعة في هذا الشهر.</p>
              </div>
            )}
          </div>
        </section>

        {/* Crop Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg w-[95vw] p-0 overflow-hidden rounded-2xl" dir="rtl">
            {selectedCrop && (
              <>
                <div className="bg-gradient-to-br from-[var(--green-pale)] to-white p-6 text-center relative">
                  <span className="text-7xl drop-shadow-md block mb-2">{selectedCrop.emoji}</span>
                  <h2 className="text-3xl font-bold font-cairo text-[var(--green-deep)]">{selectedCrop.nameAr}</h2>
                  <p className="text-sm font-cairo text-gray-500 italic mt-1">{selectedCrop.nameLa}</p>
                  <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-cairo font-bold text-[var(--green-mid)]">
                    {selectedCrop.season}
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-4 bg-white">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-[var(--green-mid)] mb-1">
                      <Droplets className="w-4 h-4" />
                      <span className="font-cairo font-bold text-sm">احتياج المياه</span>
                    </div>
                    <p className="font-cairo text-gray-700 text-sm">{selectedCrop.waterNeeds}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-orange-500 mb-1">
                      <ThermometerSun className="w-4 h-4" />
                      <span className="font-cairo font-bold text-sm">الصعوبة</span>
                    </div>
                    <p className="font-cairo text-gray-700 text-sm">{selectedCrop.difficulty}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-blue-500 mb-1">
                      <Sprout className="w-4 h-4" />
                      <span className="font-cairo font-bold text-sm">طريقة الزراعة</span>
                    </div>
                    <p className="font-cairo text-gray-700 text-sm">{selectedCrop.plantingMethod}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-purple-500 mb-1">
                      <Ruler className="w-4 h-4" />
                      <span className="font-cairo font-bold text-sm">المسافة والعمق</span>
                    </div>
                    <p className="font-cairo text-gray-700 text-sm text-xs">عمق: {selectedCrop.depth}<br/>مسافة: {selectedCrop.spacing}</p>
                  </div>

                  <div className="col-span-2 bg-[var(--sand)] p-4 rounded-xl border border-[var(--gold)]/30">
                    <h4 className="font-cairo font-bold text-[var(--green-deep)] mb-2 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[var(--gold)]" />
                      جدول الري المقترح
                    </h4>
                    <p className="font-cairo text-gray-800 text-sm">{selectedCrop.irrigationSchedule}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default HomePage;