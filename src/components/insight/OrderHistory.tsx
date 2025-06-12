
import React, { useState } from 'react';
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

  // Sample order data with more variety
  const orderData: OrderHistoryItem[] = [
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
    }
  ];

  const filterOptions = [
    { value: 'semua', label: 'Semua Tanggal' },
    { value: '7-hari', label: '7 Hari Terakhir' },
    { value: '30-hari', label: '30 Hari Terakhir' },
    { value: 'hari-ini', label: 'Hari Ini' }
  ];

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // For now, we'll show all orders regardless of filter
    return matchesSearch;
  });

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
