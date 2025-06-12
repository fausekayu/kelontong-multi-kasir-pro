import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronRight,
  Package,
  History
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
import { Button } from '@/components/ui/button';
import OrderHistory from './OrderHistory';
import ProductSales from './ProductSales';

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
  status: 'completed' | 'pending' | 'cancelled';
}

interface InsightViewProps {
  saleHistory?: SaleHistoryItem[];
}

const InsightView = ({ saleHistory = [] }: InsightViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartPeriod, setChartPeriod] = useState('daily');

  const dailySales = [
    { period: "Sen", amount: 950000 },
    { period: "Sel", amount: 820000 },
    { period: "Rab", amount: 1100000 },
    { period: "Kam", amount: 780000 },
    { period: "Jum", amount: 1250000 },
    { period: "Sab", amount: 1500000 },
    { period: "Min", amount: 950000 }
  ];

  const weeklySales = [
    { period: "Minggu 1", amount: 6500000 },
    { period: "Minggu 2", amount: 7200000 },
    { period: "Minggu 3", amount: 6800000 },
    { period: "Minggu 4", amount: 8100000 }
  ];

  const monthlySales = [
    { period: "Jan", amount: 4500000 },
    { period: "Feb", amount: 5200000 },
    { period: "Mar", amount: 4800000 },
    { period: "Apr", amount: 6100000 },
    { period: "May", amount: 5700000 },
    { period: "Jun", amount: 6500000 },
    { period: "Jul", amount: 7200000 },
    { period: "Aug", amount: 6900000 },
    { period: "Sep", amount: 7500000 },
    { period: "Oct", amount: 8200000 },
    { period: "Nov", amount: 7800000 },
    { period: "Dec", amount: 8900000 }
  ];

  const yearlySales = [
    { period: "2021", amount: 45000000 },
    { period: "2022", amount: 62000000 },
    { period: "2023", amount: 78000000 },
    { period: "2024", amount: 85000000 },
    { period: "2025", amount: 92000000 }
  ];

  const getChartData = () => {
    switch (chartPeriod) {
      case 'daily': return dailySales;
      case 'weekly': return weeklySales;
      case 'monthly': return monthlySales;
      case 'yearly': return yearlySales;
      default: return dailySales;
    }
  };

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const dailyRevenue = saleHistory.reduce((total, sale) => total + sale.total, 0);
  const dailyTransactions = saleHistory.length;
  const avgTransactionValue = dailyTransactions > 0 ? dailyRevenue / dailyTransactions : 0;

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
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
            <TabsTrigger value="products">Produk Terjual</TabsTrigger>
            <TabsTrigger value="orders">Riwayat Pesanan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            {/* Sales Chart */}
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                  Grafik Penjualan
                </h3>
                
                <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="daily">Harian</TabsTrigger>
                    <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                    <TabsTrigger value="yearly">Tahunan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {chartPeriod === 'daily' || chartPeriod === 'weekly' ? (
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value).replace('Rp', '')}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" name="Penjualan" stroke="#4f46e5" activeDot={{ r: 8 }} />
                    </LineChart>
                  ) : (
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value).replace('Rp', '')}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="amount" name="Penjualan" fill="#4f46e5" />
                    </BarChart>
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

          <TabsContent value="products" className="mt-4">
            <ProductSales saleHistory={saleHistory} />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-4">
            <OrderHistory saleHistory={saleHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InsightView;
