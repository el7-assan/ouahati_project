import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, Calendar, FileText, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';

const FinancingPage = () => {
  const programs = [
    {
      name: 'برنامج دعم الشباب الفلاحين',
      type: 'وطني',
      description: 'دعم مالي للشباب الراغبين في بدء مشاريع فلاحية في الواحات مع مواكبة تقنية.',
      conditions: [
        'العمر: 18-45 سنة',
        'مشروع فلاحي جديد أو قيد التأسيس',
        'ملكية أو إيجار أرض فلاحية موثق',
      ],
      documents: ['نسخة من البطاقة الوطنية', 'دراسة جدوى معتمدة', 'شهادة الملكية أو عقد الكراء'],
      deadline: 'مفتوح طوال العام',
      amount: 'حتى 500,000 درهم',
      link: 'https://www.agriculture.gov.ma/',
    },
    {
      name: 'برنامج تطوير الواحات',
      type: 'جهوي',
      description: 'تمويل مخصص لتطوير وتحديث البنية التحتية الفلاحية في مناطق الواحات للحفاظ على استدامتها.',
      conditions: [
        'مشروع يقع داخل النطاق الجغرافي للواحة',
        'موافقة الجماعة المحلية',
        'التزام بالممارسات الزراعية المستدامة',
      ],
      documents: ['خطة تطوير مفصلة', 'موافقة السلطات المحلية', 'تصميم طبوغرافي'],
      deadline: '30 شتنبر 2026',
      amount: 'حتى 300,000 درهم',
      link: 'https://www.draea.gov.ma/',
    },
    {
      name: 'برنامج الري الحديث',
      type: 'جهوي',
      description: 'دعم مالي لتركيب أنظمة الري بالتنقيط والري الحديث لترشيد استهلاك المياه.',
      conditions: [
        'مساحة لا تقل عن 1 هكتار',
        'استخدام نظام ري تقليدي حالياً',
        'التزام بتوفير عداد مياه',
      ],
      documents: ['دراسة تقنية لنظام الري', 'رخصة حفر بئر (إن وجدت)', 'عروض أسعار للمعدات'],
      deadline: '31 دجنبر 2026',
      amount: 'حتى 150,000 درهم',
      link: 'https://www.draea.gov.ma/',
    },
    {
      name: 'برنامج التسويق الزراعي',
      type: 'وطني',
      description: 'دعم تسويق المنتجات الفلاحية وتطوير قنوات البيع والتعبئة والتغليف.',
      conditions: [
        'إنتاج فلاحي منتظم',
        'جودة المنتجات معتمدة',
        'الانتظام في تعاونية أو مجموعة منتجين',
      ],
      documents: ['القانون الأساسي للتعاونية', 'خطة تسويقية', 'شواهد الجودة (إن وجدت)'],
      deadline: 'مفتوح طوال العام',
      amount: 'حتى 200,000 درهم',
      link: 'https://www.agriculture.gov.ma/',
    },
  ];

  return (
    <>
      <Helmet>
        <title>التمويل والدعم - واحتي</title>
        <meta name="description" content="برامج الدعم والتمويل للمشاريع الفلاحية في الواحات المغربية" />
      </Helmet>

      <div className="min-h-screen bg-[var(--cream)] pb-20 md:pb-0">
        <Header />

        <main className="container mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 bg-[var(--gold)]/10 rounded-full mb-4">
              <Banknote className="w-8 h-8 text-[var(--gold)]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-amiri text-[var(--green-deep)] mb-4">
              برامج الدعم والتمويل
            </h1>
            <p className="text-base md:text-xl font-cairo text-gray-600 max-w-2xl mx-auto">
              اكتشف الفرص التمويلية المتاحة لتطوير مشروعك الفلاحي وتحسين إنتاجيتك
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                <div className="p-5 md:p-8 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold font-cairo text-[var(--green-deep)] group-hover:text-[var(--green-mid)] transition-colors">
                      {program.name}
                    </h3>
                    <span className="px-3 py-1 bg-[var(--gold)]/10 text-[var(--gold)] text-xs md:text-sm font-cairo font-bold rounded-full whitespace-nowrap">
                      {program.type}
                    </span>
                  </div>

                  <p className="font-cairo text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                    {program.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-cairo font-bold text-[var(--green-mid)] mb-3 flex items-center gap-2 text-sm md:text-base">
                        <CheckCircle className="w-4 h-4" />
                        شروط التقديم:
                      </h4>
                      <ul className="space-y-2">
                        {program.conditions.map((condition, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[var(--gold)] mt-1 text-xs">•</span>
                            <span className="font-cairo text-xs md:text-sm text-gray-700">
                              {condition}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-cairo font-bold text-[var(--green-mid)] mb-3 flex items-center gap-2 text-sm md:text-base">
                        <FileText className="w-4 h-4" />
                        الوثائق المطلوبة:
                      </h4>
                      <ul className="space-y-2">
                        {program.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[var(--gold)] mt-1 text-xs">•</span>
                            <span className="font-cairo text-xs md:text-sm text-gray-700">
                              {doc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs md:text-sm font-cairo text-orange-600 bg-orange-50 p-3 rounded-xl">
                    <Calendar className="w-4 h-4" />
                    <span className="font-bold">آخر أجل:</span> {program.deadline}
                  </div>
                </div>

                <div className="bg-gray-50 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                  <div className="text-center sm:text-right w-full sm:w-auto">
                    <p className="text-xs font-cairo text-gray-500 mb-1">المبلغ المتاح للتمويل</p>
                    <p className="text-lg md:text-xl font-bold font-cairo text-[var(--green-deep)]">
                      {program.amount}
                    </p>
                  </div>
                  <Button
                    onClick={() => window.open(program.link, '_blank')}
                    className="w-full sm:w-auto bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo rounded-xl"
                  >
                    تقديم الطلب
                    <ExternalLink className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default FinancingPage;