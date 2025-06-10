
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Package, Users, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const InsightView = () => {
  const salesData = [
    { name: 'Sen', penjualan: 250000, transaksi: 15 },
    { name: 'Sel', penjualan: 320000, transaksi: 22 },
    { name: 'Rab', penjualan: 180000, transaksi: 12 },
    { name: 'Kam', penjualan: 450000, transaksi: 28 },
    { name: 'Jum', penjualan: 380000, transaksi: 24 },
    { name: 'Sab', penjualan: 520000, transaksi: 35 },
    { name: 'Min', penjualan: 290000, transaksi: 18 },
  ];

  const topProducts = [
    { name: 'Indomie Goreng', sold: 45, revenue: 135000 },
    { name: 'Aqua 600ml', sold: 38, revenue: 152000 },
    { name: 'Gudang Garam Surya', sold: 22, revenue: 572000 },
    { name: 'Beras Rojo Lele 5kg', sold: 8, revenue: 480000 },
    { name: 'Minyak Goreng Bimoli', sold: 15, revenue: 375000 },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Penjualan Hari Ini</p>
              <p className="text-2xl font-bold text-primary">Rp 520K</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transaksi</p>
              <p className="text-2xl font-bold text-green-600">35</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Produk Terjual</p>
              <p className="text-2xl font-bold text-purple-600">128</p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-amber-50 to-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pelanggan</p>
              <p className="text-2xl font-bold text-amber-600">23</p>
            </div>
            <Users className="w-8 h-8 text-amber-500" />
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <div className="px-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Penjualan Mingguan
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
              />
              <Line
                type="monotone"
                dataKey="penjualan"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Products */}
      <div className="px-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Produk Terlaris
          </h3>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {product.sold} pcs
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rp {product.revenue.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Stats */}
      <div className="px-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Statistik Bulanan
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { bulan: 'Jan', pendapatan: 5200000 },
                { bulan: 'Feb', pendapatan: 6100000 },
                { bulan: 'Mar', pendapatan: 7500000 },
                { bulan: 'Apr', pendapatan: 6800000 },
                { bulan: 'Mei', pendapatan: 8200000 },
                { bulan: 'Jun', pendapatan: 9100000 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
              />
              <Bar dataKey="pendapatan" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default InsightView;
