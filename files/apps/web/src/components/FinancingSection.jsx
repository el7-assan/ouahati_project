import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FinancingSection = () => {
  const programs = [
    {
      name: 'برنامج دعم الشباب الفلاحين',
      type: 'وطني',
      description: 'دعم مالي للشباب الراغبين في بدء مشاريع فلاحية في الواحات',
      conditions: [
        'العمر: 18-45 سنة',
        'مشروع فلاحي جديد',
        'ملكية أو إيجار أرض فلاحية',
      ],
      documents: ['نسخة من البطاقة الوطنية', 'دراسة جدوى معتمدة', 'شهادة الملكية أو عقد الكراء'],
      deadline: 'مفتوح طوال العام',
      amount: 'حتى 500,000 درهم',
      link: 'https://www.agriculture.gov.ma/',
    },
    {
      name: 'برنامج تطوير الواحات',
      type: 'جهوي',
      description: 'تمويل لتطوير وتحديث البنية التحتية الفلاحية في الواحات',
      conditions: [
        'مشروع تطوير واحة',
        'موافقة الجماعة المحلية',
        'التزام بالممارسات المستدامة',
      ],
      documents: ['خطة تطوير مفصلة', 'موافقة السلطات المحلية', 'تصميم طبوغرافي'],
      deadline: '30 شتنبر 2026',
      amount: 'حتى 300,000 درهم',
      link: 'https://www.draea.gov.ma/',
    },
    {
      name: 'برنامج الري الحديث',
      type: 'جهوي',
      description: 'دعم لتركيب أنظمة الري بالتنقيط والري الحديث',
      conditions: [
        'مساحة لا تقل عن 1 هكتار',
        'نظام ري تقليدي حالياً',
        'التزام بتوفير المياه',
      ],
      documents: ['دراسة تقنية لنظام الري', 'رخصة حفر بئر (إن وجدت)', 'عروض أسعار للمعدات'],
      deadline: '31 دجنبر 2026',
      amount: 'حتى 150,000 درهم',
      link: 'https://www.draea.gov.ma/',
    },
    {
      name: 'برنامج التسويق الزراعي',
      type: 'وطني',
      description: 'دعم تسويق المنتجات الفلاحية وتطوير قنوات البيع',
      conditions: [
        'إنتاج فلاحي منتظم',
        'جودة المنتجات معتمدة',
        'تعاونية أو مجموعة منتجين',
      ],
      documents: ['القانون الأساسي للتعاونية', 'خطة تسويقية', 'شواهد الجودة (إن وجدت)'],
      deadline: 'مفتوح طوال العام',
      amount: 'حتى 200,000 درهم',
      link: 'https://www.agriculture.gov.ma/',
    },
  ];

  return (
    <section id="financing" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-amiri text-[var(--green-deep)] mb-3">
            💰 برامج الدعم والتمويل
          </h2>
          <p className="text-lg font-cairo text-gray-600">
            فرص تمويلية لتطوير مشاريعك الفلاحية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white to-[var(--sand)] rounded-xl shadow-lg border-t-4 border-[var(--gold)] hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold font-cairo text-[var(--green-deep)]">
                    {program.name}
                  </h3>
                  <span className="px-3 py-1 bg-[var(--gold)] text-white text-sm font-cairo rounded-full whitespace-nowrap">
                    {program.type}
                  </span>
                </div>

                <p className="font-cairo text-gray-700 mb-6 text-lg">{program.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-cairo font-bold text-[var(--green-mid)] mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      شروط التقديم:
                    </h4>
                    <ul className="space-y-2">
                      {program.conditions.map((condition, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[var(--gold)] mt-1">•</span>
                          <span className="font-cairo text-sm text-gray-700">
                            {condition}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-cairo font-bold text-[var(--green-mid)] mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      الوثائق المطلوبة:
                    </h4>
                    <ul className="space-y-2">
                      {program.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[var(--gold)] mt-1">•</span>
                          <span className="font-cairo text-sm text-gray-700">
                            {doc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-cairo text-orange-600 bg-orange-50 p-3 rounded-lg mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="font-bold">آخر أجل للتقديم:</span> {program.deadline}
                </div>
              </div>

              <div className="bg-[var(--green-deep)] p-4 flex items-center justify-between mt-auto">
                <div>
                  <p className="text-sm font-cairo text-white/80">المبلغ المتاح</p>
                  <p className="text-xl font-bold font-cairo text-[var(--gold-light)]">
                    {program.amount}
                  </p>
                </div>
                <Button
                  onClick={() => window.open(program.link, '_blank')}
                  className="bg-[var(--gold)] hover:bg-[var(--gold-light)] text-white font-cairo text-lg px-6"
                >
                  قدم الآن
                  <ExternalLink className="mr-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;