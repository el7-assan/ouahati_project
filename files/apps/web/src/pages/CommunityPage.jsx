import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users, MessageSquare, BarChart3, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header.jsx';
import GroupsList from '@/components/GroupsList.jsx';
import PostsList from '@/components/PostsList.jsx';
import ProductionTracking from '@/components/ProductionTracking.jsx';
import EconomicTips from '@/components/EconomicTips.jsx';
const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('posts');
  return <>
      <Helmet>
        <title>المجتمع الفلاحي - واحتي</title>
        <meta name="description" content="تواصل مع المزارعين، شارك خبراتك، وتتبع إنتاجك في مجتمع واحتي" />
      </Helmet>

      <div className="min-h-screen bg-[var(--cream)]">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-bold font-amiri text-[var(--green-deep)] mb-2"> المجتمع الفلاحي</h1>
            <p className="font-cairo text-gray-600">
              تواصل، شارك، وتتبع إنتاجك مع مزارعي الواحات
            </p>
          </div>

          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 bg-white shadow-sm rounded-xl p-1 h-auto">
              <TabsTrigger value="posts" className="font-cairo py-3 data-[state=active]:bg-[var(--green-pale)] data-[state=active]:text-[var(--green-deep)] rounded-lg">
                <MessageSquare className="w-4 h-4 ml-2" />
                المنشورات
              </TabsTrigger>
              <TabsTrigger value="groups" className="font-cairo py-3 data-[state=active]:bg-[var(--green-pale)] data-[state=active]:text-[var(--green-deep)] rounded-lg">
                <Users className="w-4 h-4 ml-2" />
                المجموعات
              </TabsTrigger>
              <TabsTrigger value="production" className="font-cairo py-3 data-[state=active]:bg-[var(--green-pale)] data-[state=active]:text-[var(--green-deep)] rounded-lg">
                <BarChart3 className="w-4 h-4 ml-2" />
                تتبع الإنتاج
              </TabsTrigger>
              <TabsTrigger value="tips" className="font-cairo py-3 data-[state=active]:bg-[var(--green-pale)] data-[state=active]:text-[var(--green-deep)] rounded-lg">
                <TrendingUp className="w-4 h-4 ml-2" />
                نصائح وأسعار
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="posts" className="m-0 outline-none">
                <PostsList />
              </TabsContent>
              
              <TabsContent value="groups" className="m-0 outline-none">
                <GroupsList />
              </TabsContent>
              
              <TabsContent value="production" className="m-0 outline-none">
                <ProductionTracking />
              </TabsContent>
              
              <TabsContent value="tips" className="m-0 outline-none">
                <EconomicTips />
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </>;
};
export default CommunityPage;