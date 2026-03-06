import React, { useState, useEffect } from 'react';
import { Send, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const CommentsSection = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await pb.collection('comments').getFullList({
        filter: `post_id = "${postId}"`,
        sort: 'created',
        expand: 'author_id',
        $autoCancel: false
      });
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await pb.collection('comments').create({
        post_id: postId,
        author_id: user.id,
        content: newComment.trim()
      }, { $autoCancel: false });

      // Update post comment count
      const post = await pb.collection('posts').getOne(postId, { $autoCancel: false });
      await pb.collection('posts').update(postId, { 
        comments_count: (post.comments_count || 0) + 1 
      }, { $autoCancel: false });

      setNewComment('');
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({ title: 'خطأ', description: 'فشل في إضافة التعليق', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('حذف هذا التعليق؟')) return;
    try {
      await pb.collection('comments').delete(commentId, { $autoCancel: false });
      
      // Update post comment count
      const post = await pb.collection('posts').getOne(postId, { $autoCancel: false });
      await pb.collection('posts').update(postId, { 
        comments_count: Math.max(0, (post.comments_count || 1) - 1) 
      }, { $autoCancel: false });

      fetchComments();
      if (onCommentAdded) onCommentAdded(); // Trigger parent update
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({ title: 'خطأ', description: 'فشل في حذف التعليق', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[500px]">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-lg">
        {loading ? (
          <div className="text-center text-gray-500 font-cairo py-4">جاري تحميل التعليقات...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 font-cairo py-8">لا توجد تعليقات بعد. كن أول من يعلق!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[var(--green-pale)] rounded-full flex items-center justify-center text-[var(--green-deep)]">
                    {comment.expand?.author_id?.avatar ? (
                      <img src={pb.files.getUrl(comment.expand.author_id, comment.expand.author_id.avatar)} alt="avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-cairo font-bold text-sm text-gray-800">{comment.expand?.author_id?.name || 'مستخدم'}</p>
                    <p className="text-xs text-gray-400 font-cairo" dir="ltr">{new Date(comment.created).toLocaleString('ar-MA')}</p>
                  </div>
                </div>
                {user?.id === comment.author_id && (
                  <button onClick={() => handleDelete(comment.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="font-cairo text-gray-700 text-sm pr-10">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2 rounded-b-lg">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="اكتب تعليقاً..."
          className="font-cairo flex-grow"
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting || !newComment.trim()} className="bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white px-3">
          <Send className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </form>
    </div>
  );
};

export default CommentsSection;