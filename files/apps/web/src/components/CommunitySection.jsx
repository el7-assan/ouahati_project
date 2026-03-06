import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import TipsGrid from '@/components/TipsGrid.jsx';

const CommunitySection = () => {
  const { toast } = useToast();
  const [productions, setProductions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    crop: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
  });

  const communityGroups = [
    { name: 'مزارعو الطماطم بالرشيدية', members: 45, icon: '🍅' },
    { name: 'مزارعو النخيل بزاكورة', members: 78, icon: '🌴' },
    { name: 'مزارعو البصل بتنغير', members: 32, icon: '🧅' },
    { name: 'مزارعو الجزر بورزازات', members: 56, icon: '🥕' },
  ];

  const economicTips = [
    {
      icon: '💰',
      title: 'أسعار السوق اليوم',
      description: 'الطماطم: 4-5 دراهم/كلغ | البصل: 3-4 دراهم/كلغ | الجزر: 2-3 دراهم/كلغ',
    },
    {
      icon: '📈',
      title: 'نصيحة البيع',
      description: 'أفضل وقت لبيع الطماطم هو الصباح الباكر في السوق المحلي',
    },
    {
      icon: '🚚',
      title: 'التسويق الجماعي',
      description: 'انضم لتعاونية لتحصل على أسعار أفضل وتقليل تكاليف النقل',
    },
    {
      icon: '📊',
      title: 'تتبع الإنتاج',
      description: 'سجل إنتاجك يومياً لمعرفة أفضل المحاصيل ربحية',
    },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('productionRecords');
    if (stored) {
      try {
        setProductions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading production records:', error);
      }
    }
  }, []);

  const saveProductions = (newProductions) => {
    setProductions(newProductions);
    localStorage.setItem('productionRecords', JSON.stringify(newProductions));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.crop || !formData.quantity) {
      toast({
        title: '⚠️ خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    if (editingId) {
      const updated = productions.map((p) =>
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      saveProductions(updated);
      toast({
        title: '✅ تم التحديث',
        description: 'تم تحديث سجل الإنتاج بنجاح',
      });
    } else {
      const newProduction = {
        ...formData,
        id: Date.now(),
      };
      saveProductions([...productions, newProduction]);
      toast({
        title: '✅ تم الإضافة',
        description: 'تم إضافة سجل الإنتاج بنجاح',
      });
    }

    setFormData({ crop: '', quantity: '', date: new Date().toISOString().split('T')[0] });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (production) => {
    setFormData(production);
    setEditingId(production.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    saveProductions(productions.filter((p) => p.id !== id));
    toast({
      title: '🗑️ تم الحذف',
      description: 'تم حذف سجل الإنتاج',
    });
  };

  return (
    <section id="community" className="py-12 bg-gradient-to-b from-white to-[var(--sand)]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-amiri text-[var(--green-deep)] mb-3">
            👥 المجتمع الفلاحي
          </h2>
          <p className="text-lg font-cairo text-gray-600">
            تواصل مع المزارعين وتتبع إنتاجك
          </p>
        </motion.div>

        {/* Community Groups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold font-cairo text-[var(--green-deep)] mb-4">
            مجموعات المزارعين
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {communityGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <span className="text-4xl mb-2 block">{group.icon}</span>
                  <h4 className="font-cairo font-bold text-[var(--green-deep)] mb-1">
                    {group.name}
                  </h4>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="font-cairo text-sm">{group.members} عضو</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Production Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold font-cairo text-[var(--green-deep)]">
              📊 تتبع الإنتاج الشخصي
            </h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormData({
                      crop: '',
                      quantity: '',
                      date: new Date().toISOString().split('T')[0],
                    });
                    setEditingId(null);
                  }}
                  className="bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
                >
                  <Plus className="ml-2 h-5 w-5" />
                  إضافة سجل
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-cairo text-right">
                    {editingId ? 'تعديل سجل الإنتاج' : 'إضافة سجل إنتاج جديد'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="crop" className="font-cairo text-right block mb-2">
                      المحصول
                    </Label>
                    <Input
                      id="crop"
                      value={formData.crop}
                      onChange={(e) =>
                        setFormData({ ...formData, crop: e.target.value })
                      }
                      placeholder="مثال: 🍅 طماطم"
                      className="text-right font-cairo"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="font-cairo text-right block mb-2">
                      الكمية (كلغ)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                      placeholder="مثال: 50"
                      className="text-right font-cairo"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="font-cairo text-right block mb-2">
                      التاريخ
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="text-right font-cairo"
                      dir="rtl"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
                  >
                    {editingId ? 'تحديث' : 'إضافة'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {productions.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-cairo">
              لا توجد سجلات إنتاج. ابدأ بإضافة أول سجل!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--green-pale)]">
                    <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                      المحصول
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                      الكمية (كلغ)
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                      التاريخ
                    </th>
                    <th className="px-4 py-3 text-right font-cairo text-[var(--green-deep)]">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productions.map((production) => (
                    <tr
                      key={production.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-cairo">{production.crop}</td>
                      <td className="px-4 py-3 font-cairo">{production.quantity}</td>
                      <td className="px-4 py-3 font-cairo">{production.date}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(production)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(production.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Economic Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold font-cairo text-[var(--green-deep)] mb-4">
            💡 نصائح اقتصادية
          </h3>
          <TipsGrid tips={economicTips} />
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;