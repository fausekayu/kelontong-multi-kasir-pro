
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Scan,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const TransactionView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('semua');

  // Sample products
  const products: Product[] = [
    { id: '1', name: 'Indomie Goreng', price: 3000, stock: 50, category: 'makanan' },
    { id: '2', name: 'Coca Cola 330ml', price: 5000, stock: 30, category: 'minuman' },
    { id: '3', name: 'Sabun Lifebuoy', price: 8000, stock: 20, category: 'kebersihan' },
    { id: '4', name: 'Beras 5kg', price: 65000, stock: 15, category: 'sembako' },
    { id: '5', name: 'Aqua 600ml', price: 3500, stock: 40, category: 'minuman' },
    { id: '6', name: 'Kopi Kapal Api', price: 12000, stock: 25, category: 'makanan' },
  ];

  const categories = ['semua', 'makanan', 'minuman', 'kebersihan', 'sembako'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Cart Summary */}
      {cart.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{cartItemCount} Item di Keranjang</p>
                <p className="text-sm text-muted-foreground">
                  Total: Rp {cartTotal.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <Button className="gradient-primary text-white">
              Bayar
            </Button>
          </div>
        </Card>
      )}

      {/* Search and Scanner */}
      <Card className="p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="pl-10 h-12 border-gray-200 focus:border-primary rounded-xl"
            />
          </div>
          <Button variant="outline" className="h-12 px-4 rounded-xl border-gray-200">
            <Scan className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full ${
              selectedCategory === category 
                ? 'gradient-primary text-white' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((product) => {
          const cartItem = cart.find(item => item.id === product.id);
          const isLowStock = product.stock <= 5;
          
          return (
            <Card key={product.id} className="p-4 hover:shadow-apple-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{product.name}</h3>
                  <p className="text-lg font-bold text-primary">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={isLowStock ? "destructive" : "secondary"} className="text-xs">
                      Stok: {product.stock}
                    </Badge>
                    {isLowStock && (
                      <Badge variant="destructive" className="text-xs">
                        Hampir Habis!
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {cartItem ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-lg">{cartItem.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                      className="w-8 h-8 p-0 rounded-full"
                      disabled={cartItem.quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    Rp {(cartItem.price * cartItem.quantity).toLocaleString('id-ID')}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="w-full gradient-primary text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah ke Keranjang
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Payment Methods Modal would go here */}
    </div>
  );
};

export default TransactionView;
