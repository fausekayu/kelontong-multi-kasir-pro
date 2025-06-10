
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Package, 
  User, 
  BarChart3, 
  Store, 
  ChevronDown,
  Bell,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name: string;
    role: 'cashier' | 'owner';
    avatar?: string;
    currentStore: string;
    stores?: string[];
  };
  activeTab: 'transaction' | 'stock' | 'profile';
  onTabChange: (tab: 'transaction' | 'stock' | 'profile') => void;
  onStoreChange?: (store: string) => void;
}

const DashboardLayout = ({ 
  children, 
  currentUser, 
  activeTab, 
  onTabChange,
  onStoreChange 
}: DashboardLayoutProps) => {
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  const tabs = [
    { id: 'transaction' as const, label: 'Transaksi', icon: ShoppingCart },
    { id: 'stock' as const, label: 'Stok', icon: Package },
    { id: 'profile' as const, label: 'Profil', icon: User },
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
              
              {currentUser.role === 'owner' && currentUser.stores && (
                <div className="relative">
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
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
              </div>
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
          
          <button
            className="flex flex-col items-center space-y-1 py-2 px-3 rounded-xl text-gray-500 hover:text-gray-700 transition-all duration-200"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Insight</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
