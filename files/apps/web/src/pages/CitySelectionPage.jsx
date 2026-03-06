import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CitySelectionPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity') || '');

  const cities = [
    { id: 'Errachidia', name: 'الرشيدية', region: 'درعة تافيلالت' },
    { id: 'Zagora', name: 'زاكورة', region: 'درعة تافيلالت'},
    { id: 'Tinghir', name: 'تنغير', region: 'درعة تافيلالت'},
    { id: 'Ouarzazate', name: 'ورزازات', region: 'درعة تافيلالت'},
    { id: 'Midelt', name:'ميدلت', region: 'درعة تافيلالت'},
  ];

  const handleContinue = () => {
    if (selectedCity) {
        const cityObj = cities.find(c => c.name === selectedCity);
        if (cityObj) {
            localStorage.setItem('selectedCity', JSON.stringify(cityObj)); // ← نحفظ الكائن كـ JSON
        }
        navigate('/');
    }
  };

  return (
    <>
      <Helmet>
        <title>اختيار المدينة - واحتي</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[var(--sand)] to-[var(--cream)] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl w-full text-center"
        >
          <div className="w-20 h-20 bg-[var(--green-pale)] rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-[var(--green-deep)]" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold font-amiri text-[var(--green-deep)] mb-4">
            مرحباً بك في واحتي
          </h1>
          <p className="text-gray-600 font-cairo mb-8 text-lg">
            يرجى اختيار مدينتك أو واحتك لتقديم معلومات زراعية مخصصة لمنطقتك
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {cities.map((city) => (
              <motion.button
                key={city.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCity(city.name)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedCity === city.name
                    ? 'border-[var(--green-mid)] bg-[var(--green-pale)]/30 shadow-md'
                    : 'border-gray-100 bg-white hover:border-[var(--green-light)]'
                }`}
              >
                <span className="text-3xl">{city.icon}</span>
                <span className="font-cairo font-bold text-gray-800">{city.name}</span>
                <span className="text-xs font-cairo text-gray-500">{city.region}</span>
              </motion.button>
            ))}
          </div>

          <Button 
            onClick={handleContinue}
            disabled={!selectedCity}
            className="w-full md:w-auto px-12 py-6 text-lg font-cairo bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white rounded-xl shadow-lg disabled:opacity-50"
          >
            متابعة
            <ArrowLeft className="mr-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default CitySelectionPage;