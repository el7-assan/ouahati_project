import { useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useGroupsAndPosts = () => {
  const [groups, setGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      const records = await pb.collection('groups').getFullList({
        sort: '-created',
        expand: 'creator_id',
        $autoCancel: false
      });
      setGroups(records);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.message);
    }
  }, []);

  const fetchPosts = useCallback(async (groupId = null, searchQuery = '') => {
    try {
      setLoading(true);
      let filter = '';
      
      if (groupId) {
        filter = `group_id = "${groupId}"`;
      }
      
      if (searchQuery) {
        const searchFilter = `content ~ "${searchQuery}"`;
        filter = filter ? `${filter} && ${searchFilter}` : searchFilter;
      }

      const records = await pb.collection('posts').getList(1, 50, {
        sort: '-created',
        filter: filter,
        expand: 'author_id,group_id',
        $autoCancel: false
      });
      
      setPosts(records.items);
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