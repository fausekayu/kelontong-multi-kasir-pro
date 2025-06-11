import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import AuthLayout from '@/components/auth/AuthLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionView from '@/components/transaction/TransactionView';
import StockView from '@/components/stock/StockView';
import InsightView from '@/components/insight/InsightView';
import ProfileView from '@/components/profile/ProfileView';
import { Toaster } from '@/components/ui/sonner';

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

interface SaleHistoryItem {
  id: string;
  date: string;
  time: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentMethod: string;
}

const Index = () => {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'transaction' | 'stock' | 'insight'>('transaction');
  const [currentUser, setCurrentUser] = useState({
    name: 'John Doe',
    role: 'cashier' as 'cashier' | 'owner',
    avatar: '',
    currentStore: 'Toko Cabang 1',
    stores: ['Toko Cabang 1', 'Toko Cabang 2'],
  });
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Indomie Goreng",
      price: 3500,
      stock: 100,
      category: "Makanan",
      sku: "IND-GRG-001",
      barcode: "896861000308",
      image: "https://down-id.img.susercontent.com/file/625aa1c9929414619c17060a509757ca"
    },
    {
      id: "PRD-002",
      name: "Aqua 600ml",
      price: 5000,
      stock: 150,
      category: "Minuman",
      sku: "AQU-600-001",
      barcode: "8992741140029",
      image: "https://www.static-src.com/wcsstore/IDCAS/Attachment/MTA4NjY4Njg4/1_full01.jpg"
    },
    {
      id: "PRD-003",
      name: "Coca Cola 330ml",
      price: 6000,
      stock: 80,
      category: "Minuman",
      sku: "COC-330-001",
      barcode: "5449000000996",
      image: "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/4/18/4c9e9c3a-5854-4792-a7cd-59bb24c7954f.png"
    },
    {
      id: "PRD-004",
      name: "Beras Cap Jago 5kg",
      price: 65000,
      stock: 50,
      category: "Sembako",
      sku: "BRS-CJG-5KG",
      barcode: "8997014300020",
      image: "https://images.klikindomaret.com/products/10041444.jpg"
    },
    {
      id: "PRD-005",
      name: "Minyak Goreng Bimoli 1L",
      price: 25000,
      stock: 60,
      category: "Sembako",
      sku: "MG-BIM-1L",
      barcode: "8992691000129",
      image: "https://images.tokopedia.net/img/cache/700/product-1/2020/2/28/1777198/1777198_8239a7c9-4a4c-498a-a456-01939379c498_640_640"
    },
    {
      id: "PRD-006",
      name: "Susu Ultra Milk Cokelat 200ml",
      price: 5500,
      stock: 120,
      category: "Minuman",
      sku: "SUS-ULT-CKL-200",
      barcode: "8992955211213",
      image: "https://images.klikindomaret.com/products/10041248.jpg"
    },
    {
      id: "PRD-007",
      name: "Teh Botol Sosro",
      price: 7000,
      stock: 90,
      category: "Minuman",
      sku: "TEH-SOS-001",
      barcode: "8995002001024",
      image: "https://www.static-src.com/wcsstore/IDCAS/Attachment/MTAwMDQzOTQz/1_full01.jpg"
    },
    {
      id: "PRD-008",
      name: "Gula Pasir Gulaku 1kg",
      price: 18000,
      stock: 70,
      category: "Sembako",
      sku: "GUL-GLK-1KG",
      barcode: "8997021100014",
      image: "https://images.klikindomaret.com/products/10041447.jpg"
    },
    {
      id: "PRD-009",
      name: "Sabun Mandi Lifebuoy",
      price: 4000,
      stock: 110,
      category: "Kebersihan",
      sku: "SAB-LFB-001",
      barcode: "8999909014782",
      image: "https://www.static-src.com/wcsstore/IDCAS/Attachment/MTAwMDQ0Mjkz/1_full01.jpg"
    },
    {
      id: "PRD-010",
      name: "Shampo Clear Men",
      price: 28500,
      stock: 40,
      category: "Kebersihan",
      sku: "SHM-CLR-MEN",
      barcode: "8999999067062",
      image: "https://s3.bukalapak.com/img/34349489452/s-461-461/data.png"
    },
  ]);
  const [saleHistory, setSaleHistory] = useState<SaleHistoryItem[]>([
    {
      id: "TRX-001",
      date: "11 Jun 2025",
      time: "08:15",
      items: [
        { name: "Indomie Goreng", quantity: 5, price: 3500 },
        { name: "Aqua 600ml", quantity: 2, price: 5000 },
        { name: "Teh Botol Sosro", quantity: 1, price: 7000 }
      ],
      total: 35500,
      paymentMethod: "Tunai"
    },
    {
      id: "TRX-002",
      date: "11 Jun 2025",
      time: "09:23",
      items: [
        { name: "Beras Cap Jago 5kg", quantity: 1, price: 65000 },
        { name: "Minyak Goreng Bimoli 1L", quantity: 2, price: 25000 },
        { name: "Gula Pasir Gulaku 1kg", quantity: 1, price: 18000 }
      ],
      total: 133000,
      paymentMethod: "QRIS"
    },
    {
      id: "TRX-003",
      date: "11 Jun 2025",
      time: "10:45",
      items: [
        { name: "Shampo Clear Men", quantity: 1, price: 28500 },
        { name: "Sabun Lifebuoy", quantity: 2, price: 5500 },
        { name: "Pasta Gigi Pepsodent", quantity: 1, price: 15000 }
      ],
      total: 54500,
      paymentMethod: "Debit"
    },
    {
      id: "TRX-004",
      date: "11 Jun 2025",
      time: "11:30",
      items: [
        { name: "Marlboro Red 20", quantity: 1, price: 35000 },
        { name: "Kopi Kapal Api", quantity: 2, price: 2500 },
        { name: "Pocari Sweat", quantity: 1, price: 8000 }
      ],
      total: 48000,
      paymentMethod: "Tunai"
    },
    {
      id: "TRX-005",
      date: "11 Jun 2025",
      time: "13:15",
      items: [
        { name: "Chitato Keju", quantity: 3, price: 10000 },
        { name: "Coca Cola 330ml", quantity: 4, price: 6000 },
        { name: "Good Time Choco Chip", quantity: 2, price: 12000 }
      ],
      total: 78000,
      paymentMethod: "QRIS"
    }
  ]);

  useEffect(() => {
    if (session?.user) {
      setIsAuthenticated(true);
      // Here you might also fetch user-specific data and update currentUser
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  const handleLogin = async (credentials: any) => {
    // Implement your login logic here, e.g., using next-auth signIn
    signIn('credentials', credentials);
  };

  const handleLogout = () => {
    signOut();
    setIsAuthenticated(false);
  };

  const handleUpdateUser = (updatedUser: any) => {
    setCurrentUser({ ...currentUser, ...updatedUser });
    setShowProfile(false);
  };

  const handleStoreChange = (store: string) => {
    setCurrentUser({ ...currentUser, currentStore: store });
  };

  return (
    <div className="h-screen">
      {!isAuthenticated ? (
        <AuthLayout onLogin={handleLogin} />
      ) : showProfile ? (
        <ProfileView
          user={currentUser}
          onBack={() => setShowProfile(false)}
          onUpdateUser={handleUpdateUser}
        />
      ) : (
        <DashboardLayout
          currentUser={currentUser}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onStoreChange={handleStoreChange}
          onProfileClick={() => setShowProfile(true)}
          products={products}
        >
          {activeTab === 'transaction' && (
            <TransactionView 
              products={products}
              onUpdateProducts={setProducts}
              saleHistory={saleHistory}
              onUpdateSaleHistory={setSaleHistory}
            />
          )}
          {activeTab === 'stock' && (
            <StockView 
              products={products}
              onUpdateProducts={setProducts}
            />
          )}
          {activeTab === 'insight' && (
            <InsightView 
              saleHistory={saleHistory}
            />
          )}
        </DashboardLayout>
      )}
      <Toaster />
    </div>
  );
};

export default Index;
