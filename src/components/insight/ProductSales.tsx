
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

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

interface ProductSalesProps {
  saleHistory?: SaleHistoryItem[];
}

interface ProductSalesData {
  name: string;
  totalSold: number;
  totalRevenue: number;
  avgPrice: number;
  trend: 'up' | 'down' | 'stable';
}

const ProductSales = ({ saleHistory = [] }: ProductSalesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('semua');

  const filterOptions = [
    { value: 'semua', label: 'Semua Tanggal' },
    { value: 'hari-ini', label: 'Hari Ini' },
    { value: '7-hari', label: '7 Hari Terakhir' },
    { value: '30-hari', label: '30 Hari Terakhir' },
    { value: 'tahun-ini', label: 'Tahun Ini' },
    { value: '2024', label: 'Tahun 2024' },
    { value: '2023', label: 'Tahun 2023' },
    { value: '2022', label: 'Tahun 2022' },
    { value: '2021', label: 'Tahun 2021' },
    { value: '2020', label: 'Tahun 2020' }
  ];

  // Function to check if a date falls within the selected filter
  const isDateInFilter = (orderDate: string, filter: string): boolean => {
    if (filter === 'semua') return true;
    
    const today = new Date();
    const orderDateObj = new Date(orderDate);
    
    switch (filter) {
      case 'hari-ini':
        return orderDateObj.toDateString() === today.toDateString();
      case '7-hari':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return orderDateObj >= sevenDaysAgo && orderDateObj <= today;
      case '30-hari':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return orderDateObj >= thirtyDaysAgo && orderDateObj <= today;
      case 'tahun-ini':
        return orderDateObj.getFullYear() === today.getFullYear();
      case '2024':
      case '2023':
      case '2022':
      case '2021':
      case '2020':
        return orderDateObj.getFullYear() === parseInt(filter);
      default:
        return true;
    }
  };

  const productSalesData = useMemo(() => {
    const productMap = new Map<string, { totalSold: number; totalRevenue: number; prices: number[] }>();
    
    // Filter orders based on selected filter
    const filteredOrders = saleHistory.filter(order => isDateInFilter(order.date, selectedFilter));
    
    // Process all orders to calculate product sales
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.name) || { totalSold: 0, totalRevenue: 0, prices: [] };
        existing.totalSold += item.quantity;
        existing.totalRevenue += item.quantity * item.price;
        existing.prices.push(item.price);
        productMap.set(item.name, existing);
      });
    });

    // Convert to array and calculate averages
    const products: ProductSalesData[] = Array.from(productMap.entries()).map(([name, data]) => {
      const avgPrice = data.totalRevenue / data.totalSold;
      const trend = Math.random() > 0.5 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable';
      
      return {
        name,
        totalSold: data.totalSold,
        totalRevenue: data.totalRevenue,
        avgPrice,
        trend
      };
    });

    // Sort by total sold (descending)
    return products.sort((a, b) => b.totalSold - a.totalSold);
  }, [saleHistory, selectedFilter]);

  const filteredProducts = useMemo(() => {
    return productSalesData.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productSalesData, searchQuery]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate summary stats
  const totalProducts = filteredProducts.length;
  const totalItemsSold = filteredProducts.reduce((sum, product) => sum + product.totalSold, 0);
  const totalRevenue = filteredProducts.reduce((sum, product) => sum + product.totalRevenue, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Laporan Produk Terjual</h3>
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Data Penjualan Produk</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Produk</p>
            <p className="text-lg font-bold text-primary">{totalProducts}</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Terjual</p>
            <p className="text-lg font-bold text-blue-600">{totalItemsSold} pcs</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Pendapatan</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
        </Card>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk..."
              className="pl-10"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.map((product, index) => (
          <Card key={product.name} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-foreground">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Rata-rata harga: {formatCurrency(product.avgPrice)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">{product.totalSold} pcs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600 font-medium">{formatCurrency(product.totalRevenue)}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${getTrendColor(product.trend)}`}>
                    {getTrendIcon(product.trend)}
                    <span className="text-xs font-medium capitalize">{product.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Tidak ada produk ditemukan
          </h3>
          <p className="text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </Card>
      )}
    </div>
  );
};

export default ProductSales;
