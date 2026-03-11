import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power, Clock, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePumpLogs } from '@/hooks/usePumpLogs.js';
import { db } from '@/lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext.jsx';

const PumpControlSection = ({ currentWaterLevel }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { logs, loading: logsLoading, refetch: refetchLogs } = usePumpLogs();

  const [isPumpOn, setIsPumpOn] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAutoMode && isPumpOn && currentWaterLevel >= 100) {
      handlePumpToggle(false, 'auto_stop');
      toast({
        title: '🛑 توقف تلقائي',
        description: 'تم إيقاف المضخة تلقائياً لامتلاء الخزان',
      });
    }
  }, [currentWaterLevel, isAutoMode, isPumpOn]);

  const handlePumpToggle = async (newState, reason = 'manual') => {
    try {
      setLoading(true);

      await new Promise(resolve => setTimeout(resolve, 1000));

      await addDoc(collection(db, 'pump_logs'), {
        action: newState ? 'start' : 'stop',
        mode: isAutoMode ? 'auto' : 'manual',
        reason: reason,
        timestamp: serverTimestamp()
      });

      setIsPumpOn(newState);
      refetchLogs();

      toast({
        title: newState ? '✅ تم تشغيل المضخة' : '🛑 تم إيقاف المضخة',
        description: `الوضع: ${isAutoMode ? 'تلقائي' : 'يدوي'}`,
      });
    } catch (error) {
      toast({
        title: '❌ خطأ',
        description: 'فشل في الاتصال بالمضخة',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoMode = (checked) => {
    setIsAutoMode(checked);
    toast({
      title: checked ? '🤖 تم تفعيل الوضع التلقائي' : '✋ تم تفعيل الوضع اليدوي',
      description: checked ? 'ستعمل المضخة حسب الجدول ومستوى المياه' : 'تحكم كامل بالمضخة',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold font-cairo text-[var(--green-deep)] flex items-center gap-2">
          <Settings className="w-6 h-6" />
          التحكم في المضخة
        </h3>
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-mode" className="font-cairo text-sm text-gray-600">
            الوضع التلقائي
          </Label>
          <Switch
            id="auto-mode"
            checked={isAutoMode}
            onCheckedChange={toggleAutoMode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Manual Control */}
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePumpToggle(!isPumpOn)}
            disabled={loading || (isAutoMode && currentWaterLevel >= 100)}
            className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 shadow-xl transition-colors ${
              isPumpOn
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Power className="w-10 h-10" />
            <span className="font-cairo font-bold text-lg">
              {isPumpOn ? 'إيقاف' : 'تشغيل'}
            </span>
          </motion.button>

          {isAutoMode && currentWaterLevel >= 100 && (
            <p className="mt-4 text-sm font-cairo text-orange-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              لا يمكن التشغيل: الخزان ممتلئ
            </p>
          )}
        </div>

        {/* Schedules & Logs */}
        <div className="space-y-6">
          <div>
            <h4 className="font-cairo font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--green-mid)]" />
              جدول التشغيل التلقائي
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[var(--sand)] rounded-lg">
                <span className="font-cairo">الصباح (6:00 ص)</span>
                <Switch defaultChecked disabled={!isAutoMode} />
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--sand)] rounded-lg">
                <span className="font-cairo">المساء (6:00 م)</span>
                <Switch defaultChecked disabled={!isAutoMode} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-cairo font-bold text-gray-800 mb-3">سجل العمليات الأخير</h4>
            <div className="bg-gray-50 rounded-lg p-3 h-40 overflow-y-auto space-y-2">
              {logsLoading ? (
                <p className="text-center text-gray-500 font-cairo text-sm py-4">جاري التحميل...</p>
              ) : logs.length === 0 ? (
                <p className="text-center text-gray-500 font-cairo text-sm py-4">لا توجد سجلات</p>
              ) : (
                logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm font-cairo border-b border-gray-200 pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      {log.action === 'start' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Power className="w-4 h-4 text-red-500" />
                      )}
                      <span className={log.action === 'start' ? 'text-green-700' : 'text-red-700'}>
                        {log.action === 'start' ? 'تشغيل' : 'إيقاف'}
                      </span>
                      <span className="text-gray-500 text-xs">({log.mode})</span>
                    </div>
                    <span className="text-gray-500" dir="ltr">
                      {log.timestamp?.toDate ? new Date(log.timestamp.toDate()).toLocaleTimeString('ar-MA') : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PumpControlSection;