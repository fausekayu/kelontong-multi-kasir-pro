
import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Scan, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryFilter from './CategoryFilter';
import CartSummary from './CartSummary';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const TransactionView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('semua');

  // Sample products - expanded list
  const products: Product[] = [
    { id: '1', name: 'Indomie Goreng', price: 3000, stock: 50, category: 'makanan' },
    { id: '2', name: 'Coca Cola 330ml', price: 5000, stock: 30, category: 'minuman' },
    { id: '3', name: 'Sabun Lifebuoy', price: 8000, stock: 20, category: 'kebersihan' },
    { id: '4', name: 'Beras 5kg', price: 65000, stock: 15, category: 'sembako' },
    { id: '5', name: 'Aqua 600ml', price: 3500, stock: 40, category: 'minuman' },
    { id: '6', name: 'Kopi Kapal Api', price: 12000, stock: 25, category: 'makanan' },
    { id: '7', name: 'Minyak Goreng 1L', price: 15000, stock: 8, category: 'sembako' },
    { id: '8', name: 'Shampo Clear', price: 18000, stock: 12, category: 'kebersihan' },
    { id: '9', name: 'Teh Pucuk 350ml', price: 4000, stock: 35, category: 'minuman' },
    { id: '10', name: 'Biskuit Roma', price: 7500, stock: 22, category: 'makanan' },
    { id: '11', name: 'Gula Pasir 1kg', price: 14000, stock: 18, category: 'sembako' },
    { id: '12', name: 'Pasta Gigi Pepsodent', price: 9500, stock: 16, category: 'kebersihan' },
  ];

  const categories = ['semua', 'makanan', 'minuman', 'kebersihan', 'sembako'];

  // Calculate product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { semua: products.length };
    categories.forEach(category => {
      if (category !== 'semua') {
        counts[category] = products.filter(p => p.category === category).length;
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.barcode?.includes(searchQuery);
      const matchesCategory = selectedCategory === 'semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout with cart:', cart);
    // Here you would implement the checkout process
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Cart Summary */}
      <CartSummary cart={cart} onCheckout={handleCheckout} />

      {/* Search Bar */}
      <Card className="mx-4 bg-white shadow-apple">
        <div className="p-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk atau scan barcode..."
                className="pl-12 h-12 border-gray-200 focus:border-primary rounded-xl text-base"
              />
            </div>
            <Button 
              variant="outline" 
              className="h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              <Scan className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="px-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          productCounts={productCounts}
        />
      </div>

      {/* Results Header */}
      <div className="px-4">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredProducts.length} produk
          {searchQuery && ` untuk "${searchQuery}"`}
          {selectedCategory !== 'semua' && ` di kategori ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const cartItem = cart.find(item => item.id === product.id);
            
            return (
              <ProductCard
                key={product.id}
                product={product}
                cartItem={cartItem}
                onAddToCart={addToCart}
                onUpdateQuantity={updateQuantity}
              />
            );
          })}
        </div>
        
        {filteredProducts.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Produk tidak ditemukan
            </h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau pilih kategori lain
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TransactionView;
