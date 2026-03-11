import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import PostCard from './PostCard.jsx';
import CreatePostForm from './CreatePostForm.jsx';

const PostsList = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let q;
      if (selectedGroupFilter) {
        q = query(
          collection(db, 'posts'),
          where('group_id', '==', selectedGroupFilter),
          orderBy('created', 'desc')
        );
      } else {
        q = query(
          collection(db, 'posts'),
          orderBy('created', 'desc')
        );
      }
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: 'خطأ', description: 'فشل في جلب المنشورات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'groups'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedGroupFilter]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
        >
          <Plus className="ml-2 w-5 h-5" />
          مشاركة جديدة
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-200 rounded-md font-cairo text-sm focus:outline-none focus:ring-1 focus:ring-[var(--green-mid)] bg-gray-50"
          >
            <option value="">جميع المنشورات</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-cairo text-right text-xl text-[var(--green-deep)]">إنشاء مشاركة جديدة</DialogTitle>
          </DialogHeader>
          <CreatePostForm
            onSuccess={() => {
              setIsCreateModalOpen(false);
              fetchPosts();
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-xl font-cairo text-gray-500">لا توجد منشورات لعرضها</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={fetchPosts}
              onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PostsList;