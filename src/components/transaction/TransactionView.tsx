import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Scan, Filter, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryFilter from './CategoryFilter';
import CartSummary from './CartSummary';
import ProductCard from './ProductCard';
import CheckoutModal from './CheckoutModal';
import BarcodeScanner from './BarcodeScanner';
import { useToast } from '@/hooks/use-toast';

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

interface TransactionViewProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  saleHistory: SaleHistoryItem[];
  onUpdateSaleHistory: (saleHistory: SaleHistoryItem[]) => void;
}

// Global product data store - simulating backend storage
let globalProducts: Product[] = [
  // Makanan (Food) - 300 products
  ...Array.from({ length: 50 }, (_, i) => {
    const names = [
      'Indomie Goreng', 'Indomie Ayam Bawang', 'Mie Sedaap Goreng', 'Sarimi Ayam Bawang',
      'Pop Mie Ayam', 'Supermie Ayam', 'Gaga Baso', 'Indomie Soto Mie',
      'Mie Sedaap Kari Ayam', 'Sarimi Goreng', 'Pop Mie Pedas', 'Supermie Baso',
      'Chitato Keju', 'Taro Coklat', 'Qtela Balado', 'Pilus Garlic',
      'Chiki Balls', 'Cheetos Jagung', 'Lays Rumput Laut', 'Potabee Original',
      'Biskuit Roma Kelapa', 'Oreo Vanilla', 'Good Time Choco Chip', 'Monde Butter Cookies',
      'Khong Guan Assorted', 'Richeese Nabati', 'Wafer Tango', 'Biskuit Marie Regal',
      'Kacang Garuda', 'Kacang Dua Kelinci', 'Sukro Original', 'Kacang Atom',
      'Kopi Kapal Api', 'Kopi ABC', 'Nescafe Classic', 'Good Day Cappuccino',
      'Teh Pucuk Harum', 'Teh Kotak Jasmine', 'Ultra Milk Coklat', 'Dancow Fortigro',
      'Beras Rojo Lele 5kg', 'Beras IR64 5kg', 'Beras Pandan Wangi', 'Tepung Terigu Segitiga',
      'Gula Pasir Gulaku', 'Garam Halus Kapal', 'Minyak Goreng Bimoli', 'Margarin Blue Band',
      'Mentega Wijsman', 'Keju Kraft Cheddar'
    ];
    const name = names[i % 50];
    return {
      id: `makanan-${i + 1}`,
      name: name,
      price: Math.floor(Math.random() * 50000) + 2000,
      stock: Math.floor(Math.random() * 100) + 5,
      category: 'makanan',
      barcode: `8998888${(100000 + i).toString()}`,
      image: getProductImage(name)
    }
  }),

  // Minuman (Beverages) - 200 products
  ...Array.from({ length: 80 }, (_, i) => ({
    id: `minuman-ringan-${i + 1}`,
    name: [
      'Coca Cola 330ml', 'Pepsi 330ml', 'Sprite 330ml', 'Fanta Orange 330ml',
      'Aqua 600ml', 'Le Minerale 600ml', 'Vit 600ml', 'Club 600ml',
      'Teh Botol Sosro', 'Teh Pucuk 350ml', 'Fruit Tea Apple', 'Green Sands',
      'Pocari Sweat', 'Mizone Apple', 'Revive Isotonic', 'Hydro Coco',
      'Nu Green Tea', 'Ichitan Thai Tea', 'Okky Jelly Drink', 'Mogu Mogu'
    ][i % 20],
    price: Math.floor(Math.random() * 8000) + 2000,
    stock: Math.floor(Math.random() * 100) + 20,
    category: 'minuman'
  })),

  ...Array.from({ length: 60 }, (_, i) => ({
    id: `minuman-susu-${i + 1}`,
    name: [
      'Ultra Milk Coklat 250ml', 'Ultra Milk Strawberry', 'Indomilk Plain',
      'Greenfields UHT', 'Diamond UHT', 'Frisian Flag Coklat',
      'Bear Brand', 'Yakult Original', 'Calpico Original', 'Milkuat Coklat'
    ][i % 10],
    price: Math.floor(Math.random() * 12000) + 3000,
    stock: Math.floor(Math.random() * 60) + 15,
    category: 'minuman'
  })),

  ...Array.from({ length: 60 }, (_, i) => ({
    id: `minuman-kopi-${i + 1}`,
    name: [
      'Kopi Luwak White Coffee', 'Nescafe 3in1', 'Kopiko 78', 'ABC Susu',
      'Kapal Api Special', 'Indocafe Coffeemix', 'Top Coffee', 'Good Day Mocca'
    ][i % 8],
    price: Math.floor(Math.random() * 20000) + 5000,
    stock: Math.floor(Math.random() * 40) + 10,
    category: 'minuman'
  })),

  // Kebersihan (Cleaning & Personal Care) - 200 products
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `kebersihan-sabun-${i + 1}`,
    name: [
      'Sabun Lifebuoy', 'Sabun Dettol', 'Sabun Lux', 'Sabun Dove',
      'Sabun Nuvo', 'Sabun Citra', 'Sabun GIV', 'Sabun Shinzui'
    ][i % 8],
    price: Math.floor(Math.random() * 15000) + 3000,
    stock: Math.floor(Math.random() * 50) + 8,
    category: 'kebersihan'
  })),

  ...Array.from({ length: 40 }, (_, i) => ({
    id: `kebersihan-shampo-${i + 1}`,
    name: [
      'Shampo Clear Men', 'Shampo Pantene', 'Shampo Head & Shoulders',
      'Shampo Sunsilk', 'Shampo Dove', 'Shampo TRESemme', 'Shampo Matrix'
    ][i % 7],
    price: Math.floor(Math.random() * 30000) + 8000,
    stock: Math.floor(Math.random() * 30) + 5,
    category: 'kebersihan'
  })),

  ...Array.from({ length: 40 }, (_, i) => ({
    id: `kebersihan-pasta-gigi-${i + 1}`,
    name: [
      'Pasta Gigi Pepsodent', 'Pasta Gigi Closeup', 'Pasta Gigi Sensodyne',
      'Pasta Gigi Formula', 'Pasta Gigi Ciptadent', 'Pasta Gigi Enzim'
    ][i % 6],
    price: Math.floor(Math.random() * 20000) + 5000,
    stock: Math.floor(Math.random() * 40) + 8,
    category: 'kebersihan'
  })),

  ...Array.from({ length: 70 }, (_, i) => ({
    id: `kebersihan-deterjen-${i + 1}`,
    name: [
      'Rinso Anti Noda', 'Attack Easy', 'Surf Excel', 'Daia Deterjen',
      'Soklin Liquid', 'Molto Ultra', 'Downy Antibac', 'Wipol Karbol'
    ][i % 8],
    price: Math.floor(Math.random() * 25000) + 8000,
    stock: Math.floor(Math.random() * 25) + 5,
    category: 'kebersihan'
  })),

  // Sembako (Staples) - 150 products
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `sembako-beras-${i + 1}`,
    name: [
      'Beras Cap Jago 5kg', 'Beras Rojo Lele 5kg', 'Beras Pandan Wangi 5kg',
      'Beras IR64 Premium', 'Beras Maknyus 5kg', 'Beras Setra Ramos'
    ][i % 6],
    price: Math.floor(Math.random() * 30000) + 50000,
    stock: Math.floor(Math.random() * 20) + 5,
    category: 'sembako'
  })),

  ...Array.from({ length: 30 }, (_, i) => ({
    id: `sembako-minyak-${i + 1}`,
    name: [
      'Minyak Goreng Bimoli 1L', 'Minyak Goreng Tropical 1L', 'Minyak Goreng Filma 1L',
      'Minyak Goreng Sania 1L', 'Minyak Kelapa Barco', 'Minyak Zaitun Borges'
    ][i % 6],
    price: Math.floor(Math.random() * 10000) + 15000,
    stock: Math.floor(Math.random() * 30) + 8,
    category: 'sembako'
  })),

  ...Array.from({ length: 40 }, (_, i) => ({
    id: `sembako-tepung-${i + 1}`,
    name: [
      'Tepung Terigu Segitiga Biru', 'Tepung Beras Rose Brand', 'Tepung Maizena Honig',
      'Tepung Tapioka', 'Tepung Bumbu Sajiku', 'Tepung Roti Panko'
    ][i % 6],
    price: Math.floor(Math.random() * 8000) + 5000,
    stock: Math.floor(Math.random() * 40) + 10,
    category: 'sembako'
  })),

  ...Array.from({ length: 30 }, (_, i) => ({
    id: `sembako-gula-garam-${i + 1}`,
    name: [
      'Gula Pasir Gulaku 1kg', 'Gula Merah Jawa', 'Garam Halus Kapal',
      'Garam Beryodium Dolphin', 'Gula Aren Asli', 'Garam Dapur Refina'
    ][i % 6],
    price: Math.floor(Math.random() * 8000) + 12000,
    stock: Math.floor(Math.random() * 35) + 10,
    category: 'sembako'
  })),

  // Rokok (Cigarettes) - 100 products
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `rokok-${i + 1}`,
    name: [
      'Gudang Garam Surya 12', 'Djarum Super 12', 'Sampoerna Mild 16',
      'Marlboro Red 20', 'LA Bold 16', 'Class Mild 16',
      'Dji Sam Soe 234', 'Bentoel Biru', 'Surya Pro Mild', 'Esse Pop'
    ][i % 10],
    price: Math.floor(Math.random() * 10000) + 18000,
    stock: Math.floor(Math.random() * 50) + 10,
    category: 'rokok'
  })),

  // Alat Tulis (Stationery) - 50 products
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `alat-tulis-${i + 1}`,
    name: [
      'Pulpen Standard AE7', 'Pensil 2B Faber Castell', 'Penghapus Steadtler',
      'Buku Tulis Sinar Dunia', 'Penggaris 30cm', 'Spidol Snowman',
      'Kertas HVS A4', 'Lem Fox', 'Gunting Kenko', 'Stapler Kenko'
    ][i % 10],
    price: Math.floor(Math.random() * 15000) + 2000,
    stock: Math.floor(Math.random() * 60) + 15,
    category: 'alat-tulis'
  }))
];

// Product images mapping
function getProductImage(name: string): string {
  const productImages: Record<string, string> = {
    'Indomie Goreng': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80',
    'Indomie Ayam Bawang': 'https://images.unsplash.com/photo-1605349175158-49306906dd4e?auto=format&fit=crop&w=800&q=80',
    'Aqua 600ml': 'https://images.unsplash.com/photo-1560949003-69e8914953cb?auto=format&fit=crop&w=800&q=80',
    'Coca Cola 330ml': 'https://images.unsplash.com/photo-1624797432677-6f803a98acb3?auto=format&fit=crop&w=800&q=80',
    'Beras Cap Jago 5kg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    'Minyak Goreng Bimoli 1L': 'https://images.unsplash.com/photo-1620705876977-caab1d80f12a?auto=format&fit=crop&w=800&q=80',
    'Gudang Garam Surya 12': 'https://images.unsplash.com/photo-1566841169427-7c2b2455f3ba?auto=format&fit=crop&w=800&q=80',
    'Pulpen Standard AE7': 'https://images.unsplash.com/photo-1583485088034-4e64f143be11?auto=format&fit=crop&w=800&q=80',
    'Teh Botol Sosro': 'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?auto=format&fit=crop&w=800&q=80',
    'Pocari Sweat': 'https://images.unsplash.com/photo-1621062280640-45425f4445e1?auto=format&fit=crop&w=800&q=80',
    'Gula Pasir Gulaku': 'https://images.unsplash.com/photo-1610317951098-f3abd8e35b96?auto=format&fit=crop&w=800&q=80',
    'Sabun Lifebuoy': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ca?auto=format&fit=crop&w=800&q=80',
    'Shampo Pantene': 'https://images.unsplash.com/photo-1626766632648-f5e0c1f78047?auto=format&fit=crop&w=800&q=80',
    'Pasta Gigi Pepsodent': 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=800&q=80',
    'Marlboro Red 20': 'https://images.unsplash.com/photo-1526394931762-8a4876180952?auto=format&fit=crop&w=800&q=80',
  };
  
  return productImages[name] || 'https://images.unsplash.com/photo-1613920346957-c9a2db5a75d4?auto=format&fit=crop&w=800&q=80';
}

const TransactionView = ({ products, onUpdateProducts, saleHistory, onUpdateSaleHistory }: TransactionViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  const categories = ['semua', 'makanan', 'minuman', 'kebersihan', 'sembako', 'rokok', 'alat-tulis'];

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

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast({
      title: "Produk Dihapus",
      description: "Produk telah dihapus dari keranjang"
    });
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const updateProductStock = (purchasedItems: CartItem[]) => {
    const updatedProducts = products.map(product => {
      const purchasedItem = purchasedItems.find(item => item.id === product.id);
      if (purchasedItem) {
        return {
          ...product,
          stock: product.stock - purchasedItem.quantity
        };
      }
      return product;
    });
    
    onUpdateProducts(updatedProducts);
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    // Update product stock
    updateProductStock(cart);
    
    // Create new sale history item
    const newSaleItem: SaleHistoryItem = {
      id: `TRX-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID'),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod: paymentMethod
    };
    
    // Update sale history
    onUpdateSaleHistory([newSaleItem, ...saleHistory]);
    
    toast({
      title: "Transaksi Berhasil",
      description: `Pembayaran dengan ${paymentMethod} telah selesai`
    });
    
    // Clear cart
    setCart([]);
    setShowCheckout(false);
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      toast({
        title: "Produk Ditemukan",
        description: `${product.name} ditambahkan ke keranjang`
      });
    } else {
      toast({
        title: "Produk Tidak Ditemukan",
        description: `Barcode ${barcode} tidak terdaftar`,
        variant: "destructive"
      });
    }
    setShowScanner(false);
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    
    setCart([]);
    toast({
      title: "Keranjang Dikosongkan",
      description: "Semua produk telah dihapus dari keranjang"
    });
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Cart Summary */}
      <CartSummary 
        cart={cart} 
        onCheckout={handleCheckout} 
        onClearCart={clearCart}
        onRemoveItem={removeFromCart}
      />

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
              className="h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50 flex items-center justify-center"
              onClick={() => setShowScanner(true)}
              title="Scan Barcode"
            >
              <Scan className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-50 flex items-center justify-center"
              title="Filter"
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
                onRemoveFromCart={removeFromCart}
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

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cart={cart}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}
    </div>
  );
};

export default TransactionView;

}
