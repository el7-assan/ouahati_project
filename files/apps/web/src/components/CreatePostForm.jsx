import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

const CreatePostForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [content, setContent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'groups'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(data);
      } catch (error) {
        console.error('خطأ في جلب المجموعات:', error);
      }
    };
    fetchGroups();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previews.length > 10) {
      toast({ title: 'تنبيه', description: 'الحد الأقصى 10 صور', variant: 'destructive' });
      return;
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && previews.length === 0) {
      toast({ title: 'تنبيه', description: 'يرجى كتابة محتوى أو إضافة صورة', variant: 'destructive' });
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        author_id: user.uid,
        author_name: user.displayName || 'مستخدم',
        group_id: selectedGroup || null,
        images: previews,
        likes_count: 0,
        comments_count: 0,
        created: serverTimestamp()
      });

      toast({ title: '✅ تم النشر', description: 'تم نشر مشاركتك بنجاح' });
      setContent('');
      setSelectedGroup('');
      setPreviews([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('خطأ في إنشاء المنشور:', error);
      toast({ title: 'خطأ', description: 'فشل في نشر المشاركة', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div>
        <Label className="font-cairo text-gray-700 mb-2 block">المجموعة (اختياري)</Label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md font-cairo focus:outline-none focus:ring-2 focus:ring-[var(--green-mid)] bg-white"
        >
          <option value="">نشر للجميع (عام)</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label className="font-cairo text-gray-700 mb-2 block">محتوى المشاركة</Label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="بم تفكر؟ شارك خبراتك أو اسأل سؤالاً..."
          className="w-full min-h-[120px] p-3 rounded-md border border-gray-300 font-cairo focus:outline-none focus:ring-2 focus:ring-[var(--green-mid)] resize-y"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="font-cairo text-gray-700">الصور ({previews.length}/10)</Label>
          <label className="cursor-pointer text-[var(--green-mid)] hover:text-[var(--green-deep)] flex items-center gap-1 font-cairo text-sm">
            <ImageIcon className="w-4 h-4" />
            إضافة صور
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
            {previews.map((src, idx) => (
              <div key={idx} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                <img src={src} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Button
          type="submit"
          disabled={loading || (!content.trim() && previews.length === 0)}
          className="flex-1 bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'نشر'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 font-cairo">
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;