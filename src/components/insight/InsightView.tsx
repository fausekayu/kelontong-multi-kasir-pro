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

interface InsightViewProps {
  saleHistory?: SaleHistoryItem[];
}

interface ProductSale {
  name: string;
  quantity: number;
  transactions: number;
  revenue: number;
}

interface DayDetail {
  date: string;
  transactions: number;
  revenue: number;
  products: ProductSale[];
}

interface WeekDetail {
  weekNumber: number;
  weekRange: string;
  transactions: number;
  revenue: number;
  days: DayDetail[];
  topProduct: string;
}

interface MonthDetail {
  month: string;
  monthNumber: number;
  transactions: number;
  revenue: number;
  weeks: WeekDetail[];
  topProduct: string;
}

const InsightView = ({ saleHistory = [] }: InsightViewProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [salesRecapPeriod, setSalesRecapPeriod] = useState('daily');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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

  // Detailed sales recap data with product breakdown
  const dailyDetailedRecap: DayDetail[] = [
    {
      date: '11 Jun 2025',
      transactions: 25,
      revenue: 2450000,
      products: [
        { name: 'Indomie Goreng', quantity: 45, transactions: 12, revenue: 157500 },
        { name: 'Aqua 600ml', quantity: 38, transactions: 15, revenue: 190000 },
        { name: 'Coca Cola 330ml', quantity: 25, transactions: 8, revenue: 150000 },
        { name: 'Beras Cap Jago 5kg', quantity: 8, transactions: 6, revenue: 520000 },
        { name: 'Minyak Goreng Bimoli 1L', quantity: 15, transactions: 9, revenue: 375000 }
      ]
    },
    {
      date: '10 Jun 2025',
      transactions: 32,
      revenue: 3100000,
      products: [
        { name: 'Aqua 600ml', quantity: 52, transactions: 18, revenue: 260000 },
        { name: 'Indomie Goreng', quantity: 48, transactions: 16, revenue: 168000 },
        { name: 'Teh Botol Sosro', quantity: 28, transactions: 12, revenue: 196000 },
        { name: 'Shampo Clear Men', quantity: 12, transactions: 8, revenue: 342000 },
        { name: 'Gula Pasir Gulaku 1kg', quantity: 18, transactions: 10, revenue: 324000 }
      ]
    },
    {
      date: '09 Jun 2025',
      transactions: 28,
      revenue: 2780000,
      products: [
        { name: 'Beras Cap Jago 5kg', quantity: 12, transactions: 8, revenue: 780000 },
        { name: 'Indomie Goreng', quantity: 42, transactions: 14, revenue: 147000 },
        { name: 'Minyak Goreng Bimoli 1L', quantity: 20, transactions: 12, revenue: 500000 },
        { name: 'Sabun Lifebuoy', quantity: 35, transactions: 15, revenue: 140000 },
        { name: 'Pocari Sweat', quantity: 22, transactions: 9, revenue: 176000 }
      ]
    }
  ];

  const weeklyDetailedRecap: WeekDetail[] = [
    {
      weekNumber: 1,
      weekRange: '09-15 Jun 2025',
      transactions: 165,
      revenue: 15500000,
      topProduct: 'Indomie Goreng',
      days: [
        {
          date: '09 Jun 2025',
          transactions: 28,
          revenue: 2780000,
          products: [
            { name: 'Beras Cap Jago 5kg', quantity: 12, transactions: 8, revenue: 780000 },
            { name: 'Indomie Goreng', quantity: 42, transactions: 14, revenue: 147000 },
            { name: 'Minyak Goreng Bimoli 1L', quantity: 20, transactions: 12, revenue: 500000 }
          ]
        },
        {
          date: '10 Jun 2025',
          transactions: 32,
          revenue: 3100000,
          products: [
            { name: 'Aqua 600ml', quantity: 52, transactions: 18, revenue: 260000 },
            { name: 'Indomie Goreng', quantity: 48, transactions: 16, revenue: 168000 },
            { name: 'Teh Botol Sosro', quantity: 28, transactions: 12, revenue: 196000 }
          ]
        },
        {
          date: '11 Jun 2025',
          transactions: 25,
          revenue: 2450000,
          products: [
            { name: 'Indomie Goreng', quantity: 45, transactions: 12, revenue: 157500 },
            { name: 'Aqua 600ml', quantity: 38, transactions: 15, revenue: 190000 },
            { name: 'Coca Cola 330ml', quantity: 25, transactions: 8, revenue: 150000 }
          ]
        }
      ]
    }
  ];

  const monthlyDetailedRecap: MonthDetail[] = [
    {
      month: 'Juni 2025',
      monthNumber: 6,
      transactions: 650,
      revenue: 65000000,
      topProduct: 'Indomie Goreng',
      weeks: [
        {
          weekNumber: 1,
          weekRange: '02-08 Jun 2025',
          transactions: 158,
          revenue: 14800000,
          topProduct: 'Beras Cap Jago 5kg',
          days: [
            {
              date: '02 Jun 2025',
              transactions: 22,
              revenue: 2100000,
              products: [
                { name: 'Beras Cap Jago 5kg', quantity: 8, transactions: 6, revenue: 520000 },
                { name: 'Indomie Goreng', quantity: 35, transactions: 12, revenue: 122500 }
              ]
            }
          ]
        },
        {
          weekNumber: 2,
          weekRange: '09-15 Jun 2025',
          transactions: 165,
          revenue: 15500000,
          topProduct: 'Indomie Goreng',
          days: weeklyDetailedRecap[0].days
        }
      ]
    }
  ];

  const yearlyDetailedRecap = [
    {
      year: '2025',
      transactions: 7800,
      revenue: 920000000,
      topProduct: 'Indomie Goreng',
      months: [
        {
          month: 'Januari 2025',
          transactions: 580,
          revenue: 65000000,
          topProduct: 'Aqua 600ml',
          weeks: [
            {
              weekRange: '01-07 Jan 2025',
              transactions: 145,
              revenue: 16250000,
              days: [
                {
                  date: '01 Jan 2025',
                  transactions: 20,
                  revenue: 2300000,
                  products: [
                    { name: 'Aqua 600ml', quantity: 45, transactions: 15, revenue: 225000 },
                    { name: 'Indomie Goreng', quantity: 38, transactions: 12, revenue: 133000 }
                  ]
                }
              ]
            }
          ]
        },
        {
          month: 'Juni 2025',
          transactions: 650,
          revenue: 65000000,
          topProduct: 'Indomie Goreng',
          weeks: monthlyDetailedRecap[0].weeks
        }
      ]
    }
  ];

  const getSalesRecapData = () => {
    switch (salesRecapPeriod) {
      case 'daily': return dailyDetailedRecap;
      case 'weekly': return weeklyDetailedRecap;
      case 'monthly': return monthlyDetailedRecap;
      case 'yearly': return yearlyDetailedRecap;
      default: return dailyDetailedRecap;
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

  const renderProductList = (products: ProductSale[]) => (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground flex items-center">
        <Package className="w-4 h-4 mr-1" />
        Produk Terjual
      </h4>
      {products.map((product, idx) => (
        <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
          <div>
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              {product.quantity} pcs • {product.transactions} transaksi
            </p>
          </div>
          <span className="text-sm font-semibold text-primary">
            {formatCurrency(product.revenue)}
          </span>
        </div>
      ))}
    </div>
  );

  const renderDailyRecap = () => (
    <div className="space-y-4">
      {(getSalesRecapData() as DayDetail[]).map((day) => (
        <Card key={day.date} className="p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-medium text-lg">{day.date}</span>
              <p className="text-sm text-muted-foreground">
                {day.transactions} transaksi
              </p>
            </div>
            <Badge variant="outline">
              {formatCurrency(day.revenue)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="font-semibold">{day.transactions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="font-semibold">{formatCurrency(day.revenue / day.transactions)}</p>
            </div>
          </div>
          
          {renderProductList(day.products)}
        </Card>
      ))}
    </div>
  );

  const renderWeeklyRecap = () => (
    <div className="space-y-4">
      {(getSalesRecapData() as WeekDetail[]).map((week) => (
        <Card key={week.weekRange} className="p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-medium text-lg">Minggu {week.weekNumber}</span>
              <p className="text-sm text-muted-foreground">
                {week.weekRange} • {week.transactions} transaksi • Top: {week.topProduct}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {formatCurrency(week.revenue)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(`week-${week.weekNumber}`)}
              >
                {expandedItems[`week-${week.weekNumber}`] ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="font-semibold">{week.transactions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendapatan</p>
              <p className="font-semibold text-primary">{formatCurrency(week.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="font-semibold">{formatCurrency(week.revenue / week.transactions)}</p>
            </div>
          </div>

          {expandedItems[`week-${week.weekNumber}`] && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Detail Harian</h4>
              {week.days.map((day) => (
                <div key={day.date} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{day.date}</span>
                    <span className="text-sm text-primary font-semibold">
                      {formatCurrency(day.revenue)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {day.transactions} transaksi
                  </p>
                  {renderProductList(day.products)}
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderMonthlyRecap = () => (
    <div className="space-y-4">
      {(getSalesRecapData() as MonthDetail[]).map((month) => (
        <Card key={month.month} className="p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-medium text-lg">{month.month}</span>
              <p className="text-sm text-muted-foreground">
                {month.transactions} transaksi • Top: {month.topProduct}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {formatCurrency(month.revenue)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(`month-${month.monthNumber}`)}
              >
                {expandedItems[`month-${month.monthNumber}`] ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="font-semibold">{month.transactions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendapatan</p>
              <p className="font-semibold text-primary">{formatCurrency(month.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="font-semibold">{formatCurrency(month.revenue / month.transactions)}</p>
            </div>
          </div>

          {expandedItems[`month-${month.monthNumber}`] && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Detail Mingguan</h4>
              {month.weeks.map((week) => (
                <div key={week.weekRange} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">Minggu {week.weekNumber}</span>
                      <p className="text-xs text-muted-foreground">{week.weekRange}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-primary font-semibold">
                        {formatCurrency(week.revenue)}
                      </span>
                      <p className="text-xs text-muted-foreground">{week.transactions} transaksi</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between mt-2"
                    onClick={() => toggleExpanded(`week-${month.monthNumber}-${week.weekNumber}`)}
                  >
                    <span className="text-xs">Lihat Detail Harian</span>
                    {expandedItems[`week-${month.monthNumber}-${week.weekNumber}`] ? 
                      <ChevronDown className="w-3 h-3" /> : 
                      <ChevronRight className="w-3 h-3" />
                    }
                  </Button>

                  {expandedItems[`week-${month.monthNumber}-${week.weekNumber}`] && week.days && (
                    <div className="mt-2 space-y-2">
                      {week.days.map((day) => (
                        <div key={day.date} className="p-2 bg-muted/20 rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">{day.date}</span>
                            <span className="text-xs text-primary font-semibold">
                              {formatCurrency(day.revenue)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {day.transactions} transaksi
                          </p>
                          {renderProductList(day.products)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderYearlyRecap = () => (
    <div className="space-y-4">
      {(getSalesRecapData() as any[]).map((year) => (
        <Card key={year.year} className="p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-medium text-lg">{year.year}</span>
              <p className="text-sm text-muted-foreground">
                {year.transactions} transaksi • Top: {year.topProduct}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {formatCurrency(year.revenue)}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(`year-${year.year}`)}
              >
                {expandedItems[`year-${year.year}`] ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Transaksi</p>
              <p className="font-semibold">{year.transactions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendapatan</p>
              <p className="font-semibold text-primary">{formatCurrency(year.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata per Transaksi</p>
              <p className="font-semibold">{formatCurrency(year.revenue / year.transactions)}</p>
            </div>
          </div>

          {expandedItems[`year-${year.year}`] && (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Detail Bulanan</h4>
              {year.months.map((month: any, idx: number) => (
                <div key={month.month} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium">{month.month}</span>
                      <p className="text-xs text-muted-foreground">Top: {month.topProduct}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-primary font-semibold">
                        {formatCurrency(month.revenue)}
                      </span>
                      <p className="text-xs text-muted-foreground">{month.transactions} transaksi</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between mt-2"
                    onClick={() => toggleExpanded(`month-${year.year}-${idx}`)}
                  >
                    <span className="text-xs">Lihat Detail Mingguan</span>
                    {expandedItems[`month-${year.year}-${idx}`] ? 
                      <ChevronDown className="w-3 h-3" /> : 
                      <ChevronRight className="w-3 h-3" />
                    }
                  </Button>

                  {expandedItems[`month-${year.year}-${idx}`] && month.weeks && (
                    <div className="mt-3 space-y-2">
                      {month.weeks.map((week: any) => (
                        <div key={week.weekRange} className="p-2 bg-background rounded border">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{week.weekRange}</span>
                            <span className="text-xs text-primary font-semibold">
                              {formatCurrency(week.revenue)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {week.transactions} transaksi
                          </p>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between"
                            onClick={() => toggleExpanded(`week-${year.year}-${idx}-${week.weekRange}`)}
                          >
                            <span className="text-xs">Lihat Detail Harian</span>
                            {expandedItems[`week-${year.year}-${idx}-${week.weekRange}`] ? 
                              <ChevronDown className="w-3 h-3" /> : 
                              <ChevronRight className="w-3 h-3" />
                            }
                          </Button>

                          {expandedItems[`week-${year.year}-${idx}-${week.weekRange}`] && week.days && (
                            <div className="mt-2 space-y-2">
                              {week.days.map((day: any) => (
                                <div key={day.date} className="p-2 bg-muted/20 rounded">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium">{day.date}</span>
                                    <span className="text-xs text-primary font-semibold">
                                      {formatCurrency(day.revenue)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {day.transactions} transaksi
                                  </p>
                                  {renderProductList(day.products)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderRecapContent = () => {
    switch (salesRecapPeriod) {
      case 'daily': return renderDailyRecap();
      case 'weekly': return renderWeeklyRecap();
      case 'monthly': return renderMonthlyRecap();
      case 'yearly': return renderYearlyRecap();
      default: return renderDailyRecap();
    }
  };

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
            <TabsTrigger value="recap">Rekap Penjualan</TabsTrigger>
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
          
          <TabsContent value="recap" className="mt-4">
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Rekap Penjualan
                </h3>
                
                <Tabs value={salesRecapPeriod} onValueChange={setSalesRecapPeriod}>
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="daily">Harian</TabsTrigger>
                    <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                    <TabsTrigger value="yearly">Tahunan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              {renderRecapContent()}
            </Card>
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
