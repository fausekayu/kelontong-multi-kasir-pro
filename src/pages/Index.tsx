
import React, { useState } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionView from '@/components/transaction/TransactionView';
import StockView from '@/components/stock/StockView';
import ProfileView from '@/components/profile/ProfileView';
import InsightView from '@/components/insight/InsightView';
import CheckoutModal from '@/components/transaction/CheckoutModal';
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
  const [activeTab, setActiveTab] = useState<'transaction' | 'stock' | 'insight'>('transaction');
  const [showProfile, setShowProfile] = useState(false);

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

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const renderTabContent = () => {
    if (showProfile) {
      return (
        <ProfileView 
          currentUser={currentUser!} 
          onUserUpdate={handleUserUpdate}
          onBack={() => setShowProfile(false)}
        />
      );
    }

    switch (activeTab) {
      case 'transaction':
        return <TransactionView />;
      case 'stock':
        return <StockView />;
      case 'insight':
        return <InsightView />;
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
      onTabChange={(tab) => {
        setActiveTab(tab);
        setShowProfile(false);
      }}
      onStoreChange={handleStoreChange}
      onProfileClick={() => setShowProfile(true)}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Index;
