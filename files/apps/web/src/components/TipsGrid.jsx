import React from 'react';
import { motion } from 'framer-motion';

const TipsGrid = ({ tips }) => {
  const borderColors = [
    'border-r-[var(--green-light)]',
    'border-r-[var(--gold)]',
    'border-r-[var(--green-mid)]',
    'border-r-[var(--gold-light)]',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tips.map((tip, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white p-4 rounded-lg shadow-md border-r-4 ${
            borderColors[index % borderColors.length]
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{tip.icon}</span>
            <div>
              <h4 className="font-cairo font-bold text-[var(--green-deep)] mb-2">
                {tip.title}
              </h4>
              <p className="font-cairo text-sm text-gray-700">{tip.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TipsGrid;