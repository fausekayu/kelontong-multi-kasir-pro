
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Store, 
  ChevronDown,
  Bell,
  Search,
  User
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  barcode: string;
  image?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name: string;
    role: 'cashier' | 'owner';
    avatar?: string;
    currentStore: string;
    stores?: string[];
  };
  activeTab: 'transaction' | 'stock' | 'insight';
  onTabChange: (tab: 'transaction' | 'stock' | 'insight') => void;
  onStoreChange?: (store: string) => void;
  onProfileClick?: () => void;
  products?: Product[];
}

const DashboardLayout = ({ 
  children, 
  currentUser, 
  activeTab, 
  onTabChange,
  onStoreChange,
  onProfileClick,
  products = []
}: DashboardLayoutProps) => {
  const [showStoreSelector, setShowStoreSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotifications && !target.closest('[data-notification-container]')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const tabs = [
    { id: 'transaction' as const, label: 'Transaksi', icon: ShoppingCart },
    { id: 'stock' as const, label: 'Stok', icon: Package },
    { id: 'insight' as const, label: 'Insight', icon: BarChart3 },
  ];

  // Generate notifications based on actual product stock
  const lowStockProducts = products.filter(product => product.stock <= 10);
  
  const notifications = [
    ...lowStockProducts.map(product => ({
      id: product.id,
      message: `Stok ${product.name} ${product.stock === 0 ? 'habis' : 'hampir habis'} (${product.stock})`,
      time: '5 menit lalu',
      type: product.stock === 0 ? 'danger' : product.stock <= 5 ? 'danger' : 'warning'
    })),
    { id: 'recent-sale', message: 'Transaksi berhasil - Rp 25.000', time: '15 menit lalu', type: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">POS</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">WARLONTAR</span>
              </div>
              
              {currentUser.role === 'owner' && currentUser.stores && (
                <div className="relative hidden md:block">
                  <Button
                    variant="ghost"
                    onClick={() => setShowStoreSelector(!showStoreSelector)}
                    className="flex items-center space-x-2 text-sm font-medium"
                  >
                    <Store className="w-4 h-4" />
                    <span>{currentUser.currentStore}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {showStoreSelector && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-apple-lg border border-gray-200 py-2 z-10">
                      {currentUser.stores.map((store) => (
                        <button
                          key={store}
                          onClick={() => {
                            onStoreChange?.(store);
                            setShowStoreSelector(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          {store}
                          {store === currentUser.currentStore && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* Greeting - Hidden on mobile */}
              <div className="hidden lg:block text-right mr-4">
                <p className="text-sm text-muted-foreground">{getGreeting()}</p>
                <p className="text-lg font-semibold text-foreground">{currentUser.name}</p>
              </div>

              {/* Notifications */}
              <div className="relative" data-notification-container>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
                  )}
                </Button>
                
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 max-w-[95vw] bg-white rounded-xl shadow-apple-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-foreground">Notifikasi</h3>
                    </div>
                    <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-muted-foreground">
                          Tidak ada notifikasi
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                notif.type === 'danger' ? 'bg-red-500' :
                                notif.type === 'warning' ? 'bg-yellow-500' :
                                notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground break-words">{notif.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile */}
              <Button
                variant="ghost"
                onClick={onProfileClick}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200/50 px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
