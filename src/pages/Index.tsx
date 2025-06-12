
import React, { useState, useEffect } from 'react';
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
  status: 'completed' | 'pending' | 'cancelled';
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for demo
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

  // Generate comprehensive sale history for a full year (365 days)
  const generateYearlyOrderHistory = (): SaleHistoryItem[] => {
    const orders: SaleHistoryItem[] = [];
    const productNames = [
      "Indomie Goreng", "Aqua 600ml", "Coca Cola 330ml", "Beras Cap Jago 5kg",
      "Minyak Goreng Bimoli 1L", "Susu Ultra Milk Cokelat 200ml", "Teh Botol Sosro",
      "Gula Pasir Gulaku 1kg", "Sabun Mandi Lifebuoy", "Shampo Clear Men",
      "Chitato Keju", "Kopi Kapal Api", "Good Time Choco Chip", "Pocari Sweat",
      "Marlboro Red 20", "Pasta Gigi Pepsodent"
    ];
    
    const productPrices: { [key: string]: number } = {
      "Indomie Goreng": 3500,
      "Aqua 600ml": 5000,
      "Coca Cola 330ml": 6000,
      "Beras Cap Jago 5kg": 65000,
      "Minyak Goreng Bimoli 1L": 25000,
      "Susu Ultra Milk Cokelat 200ml": 5500,
      "Teh Botol Sosro": 7000,
      "Gula Pasir Gulaku 1kg": 18000,
      "Sabun Mandi Lifebuoy": 4000,
      "Shampo Clear Men": 28500,
      "Chitato Keju": 10000,
      "Kopi Kapal Api": 2500,
      "Good Time Choco Chip": 12000,
      "Pocari Sweat": 8000,
      "Marlboro Red 20": 35000,
      "Pasta Gigi Pepsodent": 15000
    };

    const paymentMethods = ["Tunai", "QRIS", "Debit"];
    const times = ["08:15", "09:23", "10:45", "11:20", "12:30", "13:45", "14:20", "15:15", "16:30", "17:45", "18:20", "19:30"];

    // Start from 365 days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    for (let day = 0; day < 365; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);
      
      const dateStr = currentDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Generate 2-8 random transactions per day
      const transactionsPerDay = Math.floor(Math.random() * 7) + 2;
      
      for (let t = 0; t < transactionsPerDay; t++) {
        const orderId = `TRX-${String(day * 10 + t + 1).padStart(4, '0')}`;
        const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
        const items = [];
        
        for (let i = 0; i < itemCount; i++) {
          const randomProduct = productNames[Math.floor(Math.random() * productNames.length)];
          const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
          items.push({
            name: randomProduct,
            quantity,
            price: productPrices[randomProduct]
          });
        }
        
        const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const randomTime = times[Math.floor(Math.random() * times.length)];
        const randomPayment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        
        orders.push({
          id: orderId,
          date: dateStr,
          time: randomTime,
          items,
          total,
          paymentMethod: randomPayment,
          status: "completed"
        });
      }
    }

    return orders.sort((a, b) => {
      // Sort by date descending (newest first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  };

  const [saleHistory, setSaleHistory] = useState<SaleHistoryItem[]>(() => generateYearlyOrderHistory());

  const handleLogin = async (credentials: any) => {
    // Simple demo login
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleUpdateUser = (updatedUser: any) => {
    setCurrentUser({ ...currentUser, ...updatedUser });
    setShowProfile(false);
  };

  const handleStoreChange = (store: string) => {
    setCurrentUser({ ...currentUser, currentStore: store });
  };

  const handleUpdateSaleHistory = (newSaleHistory: SaleHistoryItem[]) => {
    setSaleHistory(newSaleHistory);
  };

  return (
    <div className="h-screen">
      {!isAuthenticated ? (
        <AuthLayout title="Login" subtitle="Masuk ke sistem kasir">
          <div>Login form would go here</div>
        </AuthLayout>
      ) : showProfile ? (
        <ProfileView
          currentUser={currentUser}
          onBack={() => setShowProfile(false)}
          onUserUpdate={handleUpdateUser}
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
              onUpdateSaleHistory={handleUpdateSaleHistory}
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
