import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Trash2, User, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import CommentsSection from './CommentsSection.jsx';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [likeRecordId, setLikeRecordId] = useState(null);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    checkLikeStatus();
  }, [post.id, user]);

  const checkLikeStatus = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'likes'),
        where('post_id', '==', post.id),
        where('user_id', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setIsLiked(true);
        setLikeRecordId(snapshot.docs[0].id);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    try {
      if (isLiked && likeRecordId) {
        await deleteDoc(doc(db, 'likes', likeRecordId));
        const newCount = Math.max(0, likesCount - 1);
        await updateDoc(doc(db, 'posts', post.id), { likes_count: newCount });
        setIsLiked(false);
        setLikeRecordId(null);
        setLikesCount(newCount);
      } else {
        const record = await addDoc(collection(db, 'likes'), {
          post_id: post.id,
          user_id: user.uid,
          created: serverTimestamp()
        });
        const newCount = likesCount + 1;
        await updateDoc(doc(db, 'posts', post.id), { likes_count: newCount });
        setIsLiked(true);
        setLikeRecordId(record.id);
        setLikesCount(newCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    try {
      await deleteDoc(doc(db, 'posts', post.id));
      toast({ title: '🗑️ تم الحذف', description: 'تم حذف المنشور بنجاح' });
      if (onDelete) onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'خطأ', description: 'فشل في حذف المنشور', variant: 'destructive' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--green-mid)] to-[var(--green-light)] rounded-full flex items-center justify-center text-white overflow-hidden">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-cairo font-bold text-gray-900">{post.author_name || 'مستخدم'}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-cairo">
              <span dir="ltr">
                {post.created?.toDate ? new Date(post.created.toDate()).toLocaleDateString('ar-MA') : ''}
              </span>
            </div>
          </div>
        </div>
        {user?.uid === post.author_id && (
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-400 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="font-cairo text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="w-full bg-gray-100 max-h-96 overflow-hidden flex items-center justify-center relative">
          <img
            src={post.images[0]}
            alt="Post attachment"
            className="w-full h-full object-contain max-h-96"
          />
          {post.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-cairo flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              +{post.images.length - 1}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-6">
        <button
          onClick={handleLikeToggle}
          disabled={likeLoading}
          className={`flex items-center gap-2 font-cairo transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setIsCommentsOpen(true)}
          className="flex items-center gap-2 font-cairo text-gray-500 hover:text-[var(--green-mid)] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{commentsCount}</span>
        </button>
      </div>

      {/* Comments Modal */}
      <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-100 bg-white">
            <DialogTitle className="font-cairo text-right text-lg text-[var(--green-deep)]">التعليقات</DialogTitle>
          </DialogHeader>
          <CommentsSection
            postId={post.id}
            onCommentAdded={() => {
              setCommentsCount(prev => prev + 1);
              if (onUpdate) onUpdate();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostCard;