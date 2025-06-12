
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ChevronRight, 
  Calendar,
  Filter,
  Search,
  Package,
  Clock,
  DollarSign
} from 'lucide-react';

interface OrderHistoryItem {
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

interface OrderHistoryProps {
  saleHistory?: OrderHistoryItem[];
}

const OrderHistory = ({ saleHistory = [] }: OrderHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('semua');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const filteredOrders = useMemo(() => {
    return saleHistory.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = isDateInFilter(order.date, selectedFilter);
      
      return matchesSearch && matchesFilter;
    });
  }, [saleHistory, searchQuery, selectedFilter]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Selesai</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'tunai':
        return 'text-green-600';
      case 'qris':
        return 'text-blue-600';
      case 'debit':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Calculate summary stats for filtered orders
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Riwayat Pesanan Toko</h3>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter Tanggal Pesanan</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Pesanan</p>
            <p className="text-lg font-bold text-primary">{totalOrders}</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Pendapatan</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Rata-rata Pesanan</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(avgOrderValue)}</p>
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
              placeholder="Cari berdasarkan ID pesanan atau nama produk..."
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

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium text-primary">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{order.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{order.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{order.items.length} item</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getPaymentMethodColor(order.paymentMethod)}`}>
                      {order.paymentMethod}
                    </span>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <ChevronRight 
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedOrder === order.id ? 'rotate-90' : ''
                  }`} 
                />
              </div>
            </div>
            
            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="border-t bg-gray-50 p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Detail Produk
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <span className="font-semibold text-primary">
                        {formatCurrency(item.quantity * item.price)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Pembayaran:</span>
                    <span className="font-bold text-lg text-green-600">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Tidak ada pesanan ditemukan
          </h3>
          <p className="text-muted-foreground">
            Coba ubah filter atau kata kunci pencarian
          </p>
        </Card>
      )}
    </div>
  );
};

export default OrderHistory;
