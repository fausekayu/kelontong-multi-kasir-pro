
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface SaleData {
  name: string;
  value: number;
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

const InsightView = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('daily');

  // Sample data for charts
  const monthlySales = [
    { month: "Jan", amount: 4500000 },
    { month: "Feb", amount: 5200000 },
    { month: "Mar", amount: 4800000 },
    { month: "Apr", amount: 6100000 },
    { month: "May", amount: 5700000 },
    { month: "Jun", amount: 6500000 },
    { month: "Jul", amount: 7200000 },
    { month: "Aug", amount: 6900000 },
    { month: "Sep", amount: 7500000 },
    { month: "Oct", amount: 8200000 },
    { month: "Nov", amount: 7800000 },
    { month: "Dec", amount: 8900000 }
  ];

  const dailySales = [
    { day: "Sen", amount: 950000 },
    { day: "Sel", amount: 820000 },
    { day: "Rab", amount: 1100000 },
    { day: "Kam", amount: 780000 },
    { day: "Jum", amount: 1250000 },
    { day: "Sab", amount: 1500000 },
    { day: "Min", amount: 950000 }
  ];

  const topProducts: SaleData[] = [
    { name: "Indomie Goreng", value: 150 },
    { name: "Aqua 600ml", value: 132 },
    { name: "Coca Cola 330ml", value: 89 },
    { name: "Beras Cap Jago 5kg", value: 65 },
    { name: "Minyak Goreng Bimoli 1L", value: 55 }
  ];

  const topCategories: SaleData[] = [
    { name: "Makanan", value: 350 },
    { name: "Minuman", value: 280 },
    { name: "Sembako", value: 210 },
    { name: "Kebersihan", value: 130 },
    { name: "Rokok", value: 120 }
  ];

  // Sample transaction history
  const saleHistory: SaleHistoryItem[] = [
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
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const dailyRevenue = saleHistory.reduce((total, sale) => total + sale.total, 0);
  const dailyTransactions = saleHistory.length;
  const avgTransactionValue = dailyRevenue / dailyTransactions;

  return (
    <div className="space-y-4 pb-6">
      {/* Header Stats Cards */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-muted-foreground">Pendapatan Hari Ini</span>
              </div>
              <span className="text-lg font-bold text-green-600">{formatCurrency(dailyRevenue)}</span>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mr-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-muted-foreground">Transaksi Hari Ini</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{dailyTransactions}</span>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-muted-foreground">Rata-rata Transaksi</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{formatCurrency(avgTransactionValue)}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
            <TabsTrigger value="history">Riwayat Penjualan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            {/* Sales Chart */}
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Grafik Penjualan
                </h3>
                
                <Tabs value={period} onValueChange={setPeriod}>
                  <TabsList>
                    <TabsTrigger value="daily">Harian</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {period === 'monthly' ? (
                    <BarChart data={monthlySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value).replace('Rp', '')}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="amount" name="Penjualan" fill="#4f46e5" />
                    </BarChart>
                  ) : (
                    <LineChart data={dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value).replace('Rp', '')}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" name="Penjualan" stroke="#4f46e5" activeDot={{ r: 8 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card>
            
            {/* Top Products and Categories */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-base font-semibold mb-3">Produk Terlaris</h3>
                <div className="space-y-2">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        <span className="text-sm">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium">{product.value} pcs</span>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-base font-semibold mb-3">Kategori Terlaris</h3>
                <div className="space-y-2">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">{category.value} pcs</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Penjualan Hari Ini
                </h3>
                <span className="text-sm text-muted-foreground">11 Juni 2025</span>
              </div>
              
              <div className="space-y-4">
                {saleHistory.map((sale) => (
                  <Card key={sale.id} className="p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-medium">{sale.id}</span>
                        <p className="text-xs text-muted-foreground">{sale.time} • {sale.date}</p>
                      </div>
                      <Badge variant="outline">{sale.paymentMethod}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      {sale.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">{formatCurrency(sale.total)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InsightView;
