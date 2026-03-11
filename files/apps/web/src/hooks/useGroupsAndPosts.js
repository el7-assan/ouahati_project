import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebaseClient';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where
} from 'firebase/firestore';

export const useGroupsAndPosts = () => {
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      const q = query(collection(db, 'groups'), orderBy('created', 'desc'));
      const snapshot = await getDocs(q);
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.message);
    }
  }, []);

  const fetchPosts = useCallback(async (groupId = null, searchQuery = '') => {
    try {
      setLoading(true);
      let q;

      if (groupId) {
        q = query(
          collection(db, 'posts'),
          where('group_id', '==', groupId),
          orderBy('created', 'desc')
        );
      } else {
        q = query(collection(db, 'posts'), orderBy('created', 'desc'));
      }

      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (searchQuery) {
        data = data.filter(post =>
          post.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
    fetchPosts();
  }, [fetchGroups, fetchPosts]);

  return {
    groups,
    posts,
    loading,
    error,
    refetchGroups: fetchGroups,
    refetchPosts: fetchPosts
  };
};