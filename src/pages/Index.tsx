
import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionView from '@/components/transaction/TransactionView';
import { Card } from '@/components/ui/card';
import { Package, User } from 'lucide-react';

interface User {
  name: string;
  role: 'cashier' | 'owner';
  currentStore: string;
  stores?: string[];
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'transaction' | 'stock' | 'profile'>('transaction');

  const handleLogin = (email: string, password: string, role: 'cashier' | 'owner') => {
    // Simulate authentication
    const user: User = {
      name: role === 'owner' ? 'Ahmad Sutanto' : 'Siti Nurjannah',
      role,
      currentStore: 'Toko Berkah Jaya',
      stores: role === 'owner' ? ['Toko Berkah Jaya', 'Toko Sumber Rezeki', 'Toko Maju Terus'] : undefined
    };
    
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleStoreChange = (store: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, currentStore: store });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transaction':
        return <TransactionView />;
      case 'stock':
        return (
          <div className="space-y-4">
            <Card className="p-8 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Manajemen Stok</h3>
              <p className="text-muted-foreground">
                Kelola stok produk, update harga, dan pantau inventory toko Anda.
              </p>
            </Card>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-4">
            <Card className="p-8 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Profil Pengguna</h3>
              <p className="text-muted-foreground">
                Kelola profil, pengaturan toko, dan konfigurasi sistem.
              </p>
            </Card>
          </div>
        );
      default:
        return <TransactionView />;
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthLayout 
        title="Selamat Datang" 
        subtitle="Masuk ke sistem kasir multi-toko"
      >
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={() => console.log('Forgot password')}
          onSignUp={() => console.log('Sign up')}
        />
      </AuthLayout>
    );
  }

  return (
    <DashboardLayout
      currentUser={currentUser!}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onStoreChange={handleStoreChange}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Index;
