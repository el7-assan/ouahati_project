import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Trash2, User, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
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
      const records = await pb.collection('likes').getList(1, 1, {
        filter: `post_id = "${post.id}" && user_id = "${user.id}"`,
        $autoCancel: false
      });
      if (records.items.length > 0) {
        setIsLiked(true);
        setLikeRecordId(records.items[0].id);
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
        await pb.collection('likes').delete(likeRecordId, { $autoCancel: false });
        const newCount = Math.max(0, likesCount - 1);
        await pb.collection('posts').update(post.id, { likes_count: newCount }, { $autoCancel: false });
        setIsLiked(false);
        setLikeRecordId(null);
        setLikesCount(newCount);
      } else {
        const record = await pb.collection('likes').create({
          post_id: post.id,
          user_id: user.id
        }, { $autoCancel: false });
        const newCount = likesCount + 1;
        await pb.collection('posts').update(post.id, { likes_count: newCount }, { $autoCancel: false });
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
      await pb.collection('posts').delete(post.id, { $autoCancel: false });
      toast({ title: '🗑️ تم الحذف', description: 'تم حذف المنشور بنجاح' });
      if (onDelete) onDelete(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'خطأ', description: 'فشل في حذف المنشور', variant: 'destructive' });
    }
  };

  const author = post.expand?.author_id;
  const group = post.expand?.group_id;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
      {/* Header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--green-mid)] to-[var(--green-light)] rounded-full flex items-center justify-center text-white overflow-hidden">
            {author?.avatar ? (
              <img src={pb.files.getUrl(author, author.avatar)} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="font-cairo font-bold text-gray-900">{author?.name || 'مستخدم'}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-cairo">
              <span dir="ltr">{new Date(post.created).toLocaleDateString('ar-MA')}</span>
              {group && (
                <>
                  <span>•</span>
                  <span className="text-[var(--green-mid)] font-bold">{group.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {user?.id === post.author_id && (
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
        <div className="w-full bg-gray-100 max-h-96 overflow-hidden flex items-center justify-center">
          {/* Simple display for first image, could be expanded to carousel */}
          <img 
            src={pb.files.getUrl(post, post.images[0])} 
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