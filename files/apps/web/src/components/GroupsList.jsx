import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import CreateGroupForm from './CreateGroupForm.jsx';

const GroupsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userMemberships, setUserMemberships] = useState([]);

  const fetchGroupsAndMemberships = async () => {
    try {
      setLoading(true);
      // Fetch all groups
      const groupsData = await pb.collection('groups').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setGroups(groupsData);

      // Fetch user's memberships
      if (user) {
        const memberships = await pb.collection('group_members').getFullList({
          filter: `user_id = "${user.id}"`,
          $autoCancel: false
        });
        setUserMemberships(memberships.map(m => m.group_id));
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({ title: 'خطأ', description: 'فشل في جلب المجموعات', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsAndMemberships();
  }, [user]);

  const handleJoinToggle = async (groupId, isMember) => {
    try {
      if (isMember) {
        // Leave group
        const membership = await pb.collection('group_members').getFirstListItem(`group_id="${groupId}" && user_id="${user.id}"`, { $autoCancel: false });
        await pb.collection('group_members').delete(membership.id, { $autoCancel: false });
        
        // Update group count
        const group = groups.find(g => g.id === groupId);
        await pb.collection('groups').update(groupId, { members_count: Math.max(0, (group.members_count || 1) - 1) }, { $autoCancel: false });
        
        toast({ title: 'ℹ️ تم المغادرة', description: 'لقد غادرت المجموعة' });
      } else {
        // Join group
        await pb.collection('group_members').create({
          group_id: groupId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        }, { $autoCancel: false });
        
        // Update group count
        const group = groups.find(g => g.id === groupId);
        await pb.collection('groups').update(groupId, { members_count: (group.members_count || 0) + 1 }, { $autoCancel: false });
        
        toast({ title: '✅ تم الانضمام', description: 'لقد انضممت إلى المجموعة بنجاح' });
      }
      fetchGroupsAndMemberships();
    } catch (error) {
      console.error('Error toggling membership:', error);
      toast({ title: 'خطأ', description: 'حدث خطأ أثناء العملية', variant: 'destructive' });
    }
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="ابحث عن مجموعة..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 font-cairo"
          />
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full md:w-auto bg-[var(--green-mid)] hover:bg-[var(--green-deep)] text-white font-cairo"
        >
          <Plus className="ml-2 w-5 h-5" />
          إنشاء مجموعة جديدة
        </Button>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-cairo text-right text-xl text-[var(--green-deep)]">إنشاء مجموعة جديدة</DialogTitle>
          </DialogHeader>
          <CreateGroupForm 
            onSuccess={() => {
              setIsCreateModalOpen(false);
              fetchGroupsAndMemberships();
            }} 
            onCancel={() => setIsCreateModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md h-64 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-cairo text-gray-600">لا توجد مجموعات مطابقة</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, index) => {
            const isMember = userMemberships.includes(group.id);
            return (
              <motion.div 
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="h-32 bg-gray-100 relative">
                  {group.cover_image ? (
                    <img 
                      src={pb.files.getUrl(group, group.cover_image)} 
                      alt={group.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--green-pale)] to-[var(--sand)]">
                      <ImageIcon className="w-10 h-10 text-[var(--green-mid)] opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-cairo flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {group.members_count || 0} عضو
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold font-cairo text-[var(--green-deep)] mb-2 line-clamp-1">{group.name}</h3>
                  <p className="text-gray-600 font-cairo text-sm mb-4 line-clamp-2 flex-grow">
                    {group.description || 'لا يوجد وصف لهذه المجموعة.'}
                  </p>
                  <Button 
                    onClick={() => handleJoinToggle(group.id, isMember)}
                    variant={isMember ? "outline" : "default"}
                    className={`w-full font-cairo ${!isMember ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-white' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                  >
                    {isMember ? 'مغادرة المجموعة' : 'انضمام للمجموعة'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupsList;