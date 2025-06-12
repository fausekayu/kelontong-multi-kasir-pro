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
      paymentMethod: "Tunai",
      status: "completed"
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
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-003",
      date: "11 Jun 2025",
      time: "10:45",
      items: [
        { name: "Shampo Clear Men", quantity: 1, price: 28500 },
        { name: "Sabun Lifebuoy", quantity: 2, price: 4000 },
        { name: "Pasta Gigi Pepsodent", quantity: 1, price: 15000 }
      ],
      total: 51500,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-004",
      date: "10 Jun 2025",
      time: "14:30",
      items: [
        { name: "Coca Cola 330ml", quantity: 3, price: 6000 },
        { name: "Chitato Keju", quantity: 2, price: 10000 },
        { name: "Kopi Kapal Api", quantity: 1, price: 2500 }
      ],
      total: 40500,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-005",
      date: "10 Jun 2025",
      time: "16:15",
      items: [
        { name: "Ultra Milk Coklat", quantity: 4, price: 5500 },
        { name: "Good Time Choco Chip", quantity: 1, price: 12000 }
      ],
      total: 34000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-006",
      date: "09 Jun 2025",
      time: "11:20",
      items: [
        { name: "Marlboro Red 20", quantity: 1, price: 35000 },
        { name: "Pocari Sweat", quantity: 2, price: 8000 }
      ],
      total: 51000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-007",
      date: "08 Jun 2025",
      time: "13:45",
      items: [
        { name: "Indomie Goreng", quantity: 8, price: 3500 },
        { name: "Aqua 600ml", quantity: 3, price: 5000 }
      ],
      total: 43000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-008",
      date: "07 Jun 2025",
      time: "09:30",
      items: [
        { name: "Beras Cap Jago 5kg", quantity: 2, price: 65000 },
        { name: "Minyak Goreng Bimoli 1L", quantity: 1, price: 25000 }
      ],
      total: 155000,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-009",
      date: "06 Jun 2025",
      time: "15:20",
      items: [
        { name: "Coca Cola 330ml", quantity: 6, price: 6000 },
        { name: "Chitato Keju", quantity: 3, price: 10000 }
      ],
      total: 66000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-010",
      date: "05 Jun 2025",
      time: "12:10",
      items: [
        { name: "Shampo Clear Men", quantity: 2, price: 28500 },
        { name: "Sabun Lifebuoy", quantity: 4, price: 4000 }
      ],
      total: 73000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-011",
      date: "04 Jun 2025",
      time: "08:45",
      items: [
        { name: "Teh Botol Sosro", quantity: 5, price: 7000 },
        { name: "Pocari Sweat", quantity: 3, price: 8000 }
      ],
      total: 59000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-012",
      date: "03 Jun 2025",
      time: "14:15",
      items: [
        { name: "Ultra Milk Coklat", quantity: 6, price: 5500 },
        { name: "Good Time Choco Chip", quantity: 2, price: 12000 }
      ],
      total: 57000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-013",
      date: "02 Jun 2025",
      time: "10:30",
      items: [
        { name: "Gula Pasir Gulaku 1kg", quantity: 3, price: 18000 },
        { name: "Kopi Kapal Api", quantity: 5, price: 2500 }
      ],
      total: 66500,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-014",
      date: "01 Jun 2025",
      time: "16:45",
      items: [
        { name: "Marlboro Red 20", quantity: 2, price: 35000 },
        { name: "Aqua 600ml", quantity: 4, price: 5000 }
      ],
      total: 90000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    // May 2025 data (continuing backwards)
    {
      id: "TRX-015",
      date: "31 May 2025",
      time: "13:20",
      items: [
        { name: "Indomie Goreng", quantity: 10, price: 3500 },
        { name: "Coca Cola 330ml", quantity: 4, price: 6000 }
      ],
      total: 59000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-016",
      date: "30 May 2025",
      time: "11:15",
      items: [
        { name: "Beras Cap Jago 5kg", quantity: 1, price: 65000 },
        { name: "Minyak Goreng Bimoli 1L", quantity: 3, price: 25000 }
      ],
      total: 140000,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-017",
      date: "29 May 2025",
      time: "09:40",
      items: [
        { name: "Shampo Clear Men", quantity: 1, price: 28500 },
        { name: "Sabun Lifebuoy", quantity: 6, price: 4000 }
      ],
      total: 52500,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-018",
      date: "28 May 2025",
      time: "15:55",
      items: [
        { name: "Teh Botol Sosro", quantity: 8, price: 7000 },
        { name: "Chitato Keju", quantity: 2, price: 10000 }
      ],
      total: 76000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-019",
      date: "27 May 2025",
      time: "12:25",
      items: [
        { name: "Ultra Milk Coklat", quantity: 8, price: 5500 },
        { name: "Pocari Sweat", quantity: 4, price: 8000 }
      ],
      total: 76000,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-020",
      date: "26 May 2025",
      time: "14:10",
      items: [
        { name: "Good Time Choco Chip", quantity: 3, price: 12000 },
        { name: "Kopi Kapal Api", quantity: 8, price: 2500 }
      ],
      total: 56000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-021",
      date: "25 May 2025",
      time: "08:50",
      items: [
        { name: "Gula Pasir Gulaku 1kg", quantity: 2, price: 18000 },
        { name: "Aqua 600ml", quantity: 6, price: 5000 }
      ],
      total: 66000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-022",
      date: "24 May 2025",
      time: "16:30",
      items: [
        { name: "Marlboro Red 20", quantity: 1, price: 35000 },
        { name: "Coca Cola 330ml", quantity: 5, price: 6000 }
      ],
      total: 65000,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-023",
      date: "23 May 2025",
      time: "11:40",
      items: [
        { name: "Indomie Goreng", quantity: 12, price: 3500 },
        { name: "Teh Botol Sosro", quantity: 3, price: 7000 }
      ],
      total: 63000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-024",
      date: "22 May 2025",
      time: "13:55",
      items: [
        { name: "Beras Cap Jago 5kg", quantity: 3, price: 65000 },
        { name: "Minyak Goreng Bimoli 1L", quantity: 2, price: 25000 }
      ],
      total: 245000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-025",
      date: "21 May 2025",
      time: "10:20",
      items: [
        { name: "Shampo Clear Men", quantity: 2, price: 28500 },
        { name: "Sabun Lifebuoy", quantity: 3, price: 4000 }
      ],
      total: 69000,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-026",
      date: "20 May 2025",
      time: "15:15",
      items: [
        { name: "Ultra Milk Coklat", quantity: 5, price: 5500 },
        { name: "Pocari Sweat", quantity: 6, price: 8000 }
      ],
      total: 75500,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-027",
      date: "19 May 2025",
      time: "09:05",
      items: [
        { name: "Chitato Keju", quantity: 4, price: 10000 },
        { name: "Good Time Choco Chip", quantity: 2, price: 12000 }
      ],
      total: 64000,
      paymentMethod: "QRIS",
      status: "completed"
    },
    {
      id: "TRX-028",
      date: "18 May 2025",
      time: "14:45",
      items: [
        { name: "Kopi Kapal Api", quantity: 10, price: 2500 },
        { name: "Aqua 600ml", quantity: 8, price: 5000 }
      ],
      total: 65000,
      paymentMethod: "Debit",
      status: "completed"
    },
    {
      id: "TRX-029",
      date: "17 May 2025",
      time: "12:35",
      items: [
        { name: "Gula Pasir Gulaku 1kg", quantity: 4, price: 18000 },
        { name: "Coca Cola 330ml", quantity: 3, price: 6000 }
      ],
      total: 90000,
      paymentMethod: "Tunai",
      status: "completed"
    },
    {
      id: "TRX-030",
      date: "16 May 2025",
      time: "16:20",
      items: [
        { name: "Marlboro Red 20", quantity: 3, price: 35000 },
        { name: "Teh Botol Sosro", quantity: 2, price: 7000 }
      ],
      total: 119000,
      paymentMethod: "QRIS",
      status: "completed"
    }
  ]);

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
