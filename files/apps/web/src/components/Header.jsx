import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Home, Droplets, Banknote, Users, User, LogOut, MapPin, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const Header = () => {
  const [cityName, setCityName] = useState('منطقتك');
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  useEffect(() => {
  const saved = localStorage.getItem('selectedCity');
  if (saved) {
    try {
      const cityObj = JSON.parse(saved);
      setCityName(cityObj.name || 'منطقتك');
    } catch (e) {
      console.error('خطأ في قراءة المدينة في Header', e);
    }
  }}, []);
  const navItems = [{
    path: '/',
    label: 'الرئيسية',
    icon: <Home className="w-5 h-5 md:w-4 md:h-4" />
  }, {
    path: '/smart-watering',
    label: 'الري الذكي',
    icon: <Droplets className="w-5 h-5 md:w-4 md:h-4" />
  }, {
    path: '/financing',
    label: 'التمويل',
    icon: <Banknote className="w-5 h-5 md:w-4 md:h-4" />
  }, {
    path: '/community',
    label: 'المجتمع',
    icon: <Users className="w-5 h-5 md:w-4 md:h-4" />
  }];
  return <>
      {/* Desktop & Mobile Top Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo - Right Side (RTL) */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl"></span>
              <span className="text-xl md:text-2xl font-bold font-amiri text-[var(--green-deep)]">
                واحتي
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return <Link key={item.path} to={item.path} className={`flex items-center gap-2 font-cairo transition-colors py-2 border-b-2 ${isActive ? 'text-[var(--green-mid)] border-[var(--green-mid)] font-bold' : 'text-gray-600 border-transparent hover:text-[var(--green-mid)]'}`}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>;
            })}
            </nav>

            {/* User Profile - Left Side (RTL) */}
            <div className="flex items-center gap-3">
              {cityName !== 'منطقتك' && (
              <div className="hidden md:flex items-center gap-1 text-sm text-[var(--green-mid)] font-cairo bg-[var(--green-pale)] px-3 py-1 rounded-full">
                <MapPin className="w-3 h-3" />
                {cityName}
              </div>)}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 md:px-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green-mid)] to-[var(--green-light)] flex items-center justify-center text-white shadow-sm">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden md:block font-cairo text-[var(--green-deep)] font-bold">
                      {user?.name || 'مستخدم'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48" dir="rtl">
                  <DropdownMenuItem onClick={() => navigate('/city-selection')} className="cursor-pointer">
                    <MapPin className="ml-2 h-4 w-4 text-gray-500" />
                    <span className="font-cairo">تغيير المدينة</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span className="font-cairo">تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <nav className="flex items-center justify-around h-16 px-2">
          {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-[var(--green-mid)]' : 'text-gray-400 hover:text-gray-600'}`}>
                <div className={`${isActive ? 'bg-[var(--green-pale)] p-1.5 rounded-full' : 'p-1.5'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-cairo ${isActive ? 'font-bold' : 'font-normal'}`}>
                  {item.label}
                </span>
              </Link>;
        })}
        </nav>
      </div>
    </>;
};
export default Header;