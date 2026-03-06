import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Share2, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: '⚠️ خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    login({
      name: formData.name,
      email: formData.email,
    });

    toast({
      title: '✅ مرحباً بك!',
      description: `أهلاً ${formData.name}، تم تسجيل الدخول بنجاح`,
    });

    navigate('/city-selection');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      '🌴 اكتشف واحتي - تطبيق التقويم الزراعي للواحات المغربية!\n\n' +
      'تطبيق ذكي يساعد المزارعين على:\n' +
      '✅ معرفة أفضل أوقات الزراعة\n' +
      '✅ إدارة الري بذكاء\n' +
      '✅ الحصول على التمويل\n' +
      '✅ التواصل مع المزارعين\n\n' +
      'انضم إلينا الآن! 🚀'
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>تسجيل الدخول - واحتي</title>
        <meta
          name="description"
          content="سجل الدخول إلى واحتي - تطبيق التقويم الزراعي للواحات المغربية"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[var(--green-deep)] via-[var(--green-mid)] to-[var(--green-light)] flex items-center justify-center p-4">
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--green-mid)] to-[var(--green-light)] rounded-full mb-4"
            >
              <Sprout className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold font-amiri text-[var(--green-deep)] mb-2">
              مرحباً بك في واحتي
            </h1>
            <p className="font-cairo text-gray-600">
              تطبيق التقويم الزراعي للواحات المغربية
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-cairo text-right block mb-2">
                الاسم الكامل
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="text-right font-cairo text-gray-900"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-cairo text-right block mb-2">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className="text-right font-cairo text-gray-900"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="password" className="font-cairo text-right block mb-2">
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="أدخل كلمة المرور"
                className="text-right font-cairo text-gray-900"
                dir="rtl"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--green-mid)] to-[var(--green-light)] hover:from-[var(--green-deep)] hover:to-[var(--green-mid)] text-white font-cairo text-lg py-6"
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* WhatsApp Share */}
          <div className="mt-6">
            <Button
              onClick={handleWhatsAppShare}
              variant="outline"
              className="w-full border-2 border-[var(--green-mid)] text-[var(--green-mid)] hover:bg-[var(--green-pale)] font-cairo"
            >
              <Share2 className="ml-2 h-5 w-5" />
              شارك التطبيق عبر واتساب
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm font-cairo text-gray-600">
              🌴 معاً نحو واحات أكثر ازدهاراً
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;