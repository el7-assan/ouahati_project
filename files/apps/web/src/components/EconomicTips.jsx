import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, Lightbulb, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const EconomicTips = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [prices, setPrices] = useState([
    { crop: 'طماطم', price: '4.50', trend: 'up', change: '+5%', unit: 'درهم/كلغ' },
    { crop: 'بصل', price: '3.20', trend: 'down', change: '-2%', unit: 'درهم/كلغ' },
    { crop: 'جزر', price: '2.80', trend: 'up', change: '+1%', unit: 'درهم/كلغ' },
    { crop: 'بطيخ', price: '2.00', trend: 'down', change: '-4%', unit: 'درهم/كلغ' },
    { crop: 'تمور (مجهول)', price: '35.00', trend: 'up', change: '+10%', unit: 'درهم/كلغ' },
  ]);

  const tips = [
    {
      title: 'التسويق المباشر',
      desc: 'حاول بيع منتجاتك مباشرة للمستهلكين في الأسواق الأسبوعية لزيادة هامش الربح وتجنب الوسطاء.',
    },
    {
      title: 'التخزين الذكي',
      desc: 'تخزين البصل والبطاطس في أماكن جيدة التهوية يمكن أن يرفع قيمتها بنسبة 20% عند بيعها خارج موسم الذروة.',
    },
    {
      title: 'التعاونيات الفلاحية',
      desc: 'الانضمام إلى تعاونية يساعد في شراء الأسمدة بأسعار الجملة وتوفير تكاليف النقل.',
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate price updates
      setPrices(prices.map(p => ({
        ...p,
        price: (parseFloat(p.price) * (1 + (Math.random() * 0.1 - 0.05))).toFixed(2),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 8)}%`
      })));
      setIsRefreshing(false);
      toast({
        title: '✅ تم التحديث',
        description: 'تم تحديث أسعار السوق بنجاح',
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Market Prices */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-cairo text-[var(--green-deep)] flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[var(--gold)]" />
            أسعار السوق اليوم
          </h3>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline" 
            className="font-cairo border-[var(--green-mid)] text-[var(--green-mid)]"
          >
            <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            تحديث الأسعار
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--sand)]">
                <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)] rounded-tr-lg">المحصول</th>
                <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">السعر</th>
                <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">التغير اليومي</th>
                <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)] rounded-tl-lg">الاتجاه</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-cairo font-bold text-gray-800">{item.crop}</td>
                  <td className="px-4 py-4 font-cairo text-[var(--green-deep)]">{item.price} {item.unit}</td>
                  <td className="px-4 py-4 font-cairo">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.change}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-mid)] rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-2xl font-bold font-cairo mb-6 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-[var(--gold)]" />
          نصائح تسويقية واقتصادية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20"
            >
              <h4 className="font-cairo font-bold text-[var(--gold-light)] mb-3 text-lg">{tip.title}</h4>
              <p className="font-cairo text-white/90 text-sm leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EconomicTips;