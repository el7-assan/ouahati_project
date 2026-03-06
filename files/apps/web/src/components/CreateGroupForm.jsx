import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const CreateGroupForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cover_image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, cover_image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: 'تنبيه', description: 'اسم المجموعة مطلوب', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('creator_id', user.id);
      data.append('members_count', 1);
      
      if (formData.cover_image) {
        data.append('cover_image', formData.cover_image);
      }

      const newGroup = await pb.collection('groups').create(data, { $autoCancel: false });
      
      // Auto-join the creator to the group
      await pb.collection('group_members').create({
        group_id: newGroup.id,
        user_id: user.id,
        joined_at: new Date().toISOString()
      }, { $autoCancel: false });

      toast({ title: '✅ تم بنجاح', description: 'تم إنشاء المجموعة بنجاح' });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({ title: 'خطأ', description: 'فشل في إنشاء المجموعة', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      <div>
        <Label className="font-cairo text-gray-700">اسم المجموعة <span className="text-red-500">*</span></Label>
        <Input 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="مثال: مزارعو النخيل بزاكورة"
          className="font-cairo mt-1"
          required
        />
      </div>

      <div>
        <Label className="font-cairo text-gray-700">وصف المجموعة</Label>
        <textarea 
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="وصف قصير لأهداف المجموعة..."
          className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 font-cairo mt-1 focus:outline-none focus:ring-2 focus:ring-[var(--green-mid)]"
        />
      </div>

      <div>
        <Label className="font-cairo text-gray-700 mb-2 block">صورة الغلاف</Label>
        {preview ? (
          <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => { setPreview(null); setFormData({...formData, cover_image: null}); }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="font-cairo text-sm text-gray-500">اضغط أو اسحب الصورة هنا</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
        >
          {loading ? 'جاري الإنشاء...' : 'إنشاء المجموعة'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 font-cairo"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default CreateGroupForm;