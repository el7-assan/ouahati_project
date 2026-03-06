import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, BarChart3, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProductionTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    price_per_unit: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchRecords = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await pb.collection('production_records').getFullList({
        filter: `user_id = "${user.id}"`,
        sort: '-date',
        $autoCancel: false
      });
      setRecords(data);
    } catch (error) {
      console.error('Error fetching production records:', error);
      toast({ title: 'خطأ', description: 'فشل في جلب سجلات الإنتاج', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.crop_name || !formData.quantity || !formData.price_per_unit) {
      toast({ title: 'تنبيه', description: 'يرجى ملء جميع الحقول', variant: 'destructive' });
      return;
    }

    try {
      await pb.collection('production_records').create({
        ...formData,
        user_id: user.id,
        quantity: Number(formData.quantity),
        price_per_unit: Number(formData.price_per_unit),
      }, { $autoCancel: false });
      
      toast({ title: '✅ تم بنجاح', description: 'تمت إضافة سجل الإنتاج' });
      setIsDialogOpen(false);
      setFormData({ crop_name: '', quantity: '', price_per_unit: '', date: new Date().toISOString().split('T')[0] });
      fetchRecords();
    } catch (error) {
      console.error('Error creating record:', error);
      toast({ title: 'خطأ', description: 'فشل في إضافة السجل', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
    try {
      await pb.collection('production_records').delete(id, { $autoCancel: false });
      toast({ title: '🗑️ تم الحذف', description: 'تم حذف السجل بنجاح' });
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({ title: 'خطأ', description: 'فشل في حذف السجل', variant: 'destructive' });
    }
  };

  const totalRevenue = records.reduce((sum, record) => sum + (record.quantity * record.price_per_unit), 0);

  // Prepare chart data (aggregate by crop)
  const chartDataMap = records.reduce((acc, record) => {
    if (!acc[record.crop_name]) {
      acc[record.crop_name] = { name: record.crop_name, quantity: 0, revenue: 0 };
    }
    acc[record.crop_name].quantity += record.quantity;
    acc[record.crop_name].revenue += (record.quantity * record.price_per_unit);
    return acc;
  }, {});
  const chartData = Object.values(chartDataMap);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-[var(--gold)]">
          <p className="font-cairo text-gray-500 mb-1">إجمالي الإيرادات</p>
          <h4 className="text-3xl font-bold font-cairo text-[var(--green-deep)]">{totalRevenue.toLocaleString()} درهم</h4>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-[var(--green-mid)]">
          <p className="font-cairo text-gray-500 mb-1">إجمالي السجلات</p>
          <h4 className="text-3xl font-bold font-cairo text-[var(--green-deep)]">{records.length} سجل</h4>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border-r-4 border-[var(--green-light)] flex items-center justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-full bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo text-lg">
                <Plus className="ml-2 h-5 w-5" />
                إضافة إنتاج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="font-cairo text-right text-xl text-[var(--green-deep)]">إضافة سجل إنتاج</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label className="font-cairo">المحصول</Label>
                  <Input 
                    value={formData.crop_name} 
                    onChange={e => setFormData({...formData, crop_name: e.target.value})} 
                    placeholder="مثال: طماطم، تمر..." 
                    className="font-cairo mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-cairo">الكمية (كلغ)</Label>
                    <Input 
                      type="number" 
                      value={formData.quantity} 
                      onChange={e => setFormData({...formData, quantity: e.target.value})} 
                      className="font-cairo mt-1"
                    />
                  </div>
                  <div>
                    <Label className="font-cairo">السعر للوحدة (درهم)</Label>
                    <Input 
                      type="number" 
                      step="0.01"
                      value={formData.price_per_unit} 
                      onChange={e => setFormData({...formData, price_per_unit: e.target.value})} 
                      className="font-cairo mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-cairo">التاريخ</Label>
                  <Input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    className="font-cairo mt-1"
                  />
                </div>
                <Button type="submit" className="w-full bg-[var(--gold)] hover:bg-[var(--gold-light)] text-white font-cairo mt-4">
                  حفظ السجل
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            الإنتاج حسب المحصول (كلغ)
          </h3>
          <div className="h-64 w-full" dir="ltr">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontFamily: 'Cairo', fontSize: 12 }} />
                  <YAxis tick={{ fontFamily: 'Cairo', fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontFamily: 'Cairo', borderRadius: '8px' }} />
                  <Bar dataKey="quantity" fill="var(--green-mid)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-cairo">لا توجد بيانات كافية للرسم البياني</div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)] mb-6 flex items-center gap-2">
            <TableIcon className="w-5 h-5" />
            سجل الإنتاج
          </h3>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="bg-[var(--sand)]">
                  <th className="px-4 py-2 text-right font-cairo text-[var(--green-deep)]">المحصول</th>
                  <th className="px-4 py-2 text-right font-cairo text-[var(--green-deep)]">الكمية</th>
                  <th className="px-4 py-2 text-right font-cairo text-[var(--green-deep)]">الإيراد</th>
                  <th className="px-4 py-2 text-right font-cairo text-[var(--green-deep)]">التاريخ</th>
                  <th className="px-4 py-2 text-center font-cairo text-[var(--green-deep)]">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-4 font-cairo">جاري التحميل...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 font-cairo text-gray-500">لا توجد سجلات</td></tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-cairo font-bold">{record.crop_name}</td>
                      <td className="px-4 py-3 font-cairo">{record.quantity} كلغ</td>
                      <td className="px-4 py-3 font-cairo text-[var(--green-mid)]">{(record.quantity * record.price_per_unit).toLocaleString()} د.م</td>
                      <td className="px-4 py-3 font-cairo text-sm text-gray-500">{new Date(record.date).toLocaleDateString('ar-MA')}</td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionTracking;