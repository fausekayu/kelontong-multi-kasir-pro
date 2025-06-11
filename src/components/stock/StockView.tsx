import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Scan, Package, AlertTriangle } from 'lucide-react';
import CategoryFilter from '../transaction/CategoryFilter';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import BarcodeScanner from '../transaction/BarcodeScanner';
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

// Simple state for global products (simulating a backend)
let globalProducts: Product[] = [];

const StockView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Initialize products on first load
  useEffect(() => {
    if (globalProducts.length === 0) {
      // Generate sample products similar to TransactionView
      const generatedProducts = [
        // Makanan (Food) - 300 products
        ...Array.from({ length: 50 }, (_, i) => ({
          id: `makanan-${i + 1}`,
          name: [
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
          ][i % 50],
          price: Math.floor(Math.random() * 50000) + 2000,
          stock: Math.floor(Math.random() * 100) + 5,
          category: 'makanan',
          barcode: `8998888${(100000 + i).toString()}`
        })),

        // ... other product categories
      ];
      
      globalProducts = generatedProducts;
    }
    
    setProducts(globalProducts);
  }, []);

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

  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= 10);
  }, [products]);

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleProductUpdate = (updatedProduct: Product) => {
    // Update local products state
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    
    setProducts(updatedProducts);
    
    // Update global products state
    globalProducts = updatedProducts;
    
    setShowEditModal(false);
    
    toast({
      title: "Produk Diperbarui",
      description: `${updatedProduct.name} telah diperbarui`
    });
  };

  const handleAddProduct = (newProduct: Product) => {
    const productWithId = {
      ...newProduct,
      id: `product-${Date.now()}`,
    };
    
    // Update local products state
    setProducts(prevProducts => [...prevProducts, productWithId]);
    
    // Update global products state
    globalProducts = [...globalProducts, productWithId];
    
    setShowAddModal(false);
    
    toast({
      title: "Produk Ditambahkan",
      description: `${newProduct.name} telah ditambahkan`
    });
  };

  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      setSelectedProduct(product);
      setShowEditModal(true);
      toast({
        title: "Produk Ditemukan",
        description: `${product.name} siap untuk diedit`
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

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: 'Habis', color: 'bg-red-500' };
    if (stock <= 10) return { label: 'Sedikit', color: 'bg-yellow-500' };
    if (stock <= 50) return { label: 'Normal', color: 'bg-blue-500' };
    return { label: 'Banyak', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header Stats */}
      <div className="px-4 grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Produk</p>
              <p className="text-xl font-bold text-blue-600">{products.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Stok Menipis</p>
              <p className="text-xl font-bold text-red-600">{lowStockProducts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Add Product */}
      <Card className="mx-4 bg-white shadow-apple">
        <div className="p-4">
          <div className="flex space-x-3 mb-4">
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
              onClick={() => setShowScanner(true)}
            >
              <Scan className="w-5 h-5" />
            </Button>
          </div>
          
          <Button 
            onClick={() => setShowAddModal(true)}
            className="w-full h-12 gradient-primary text-white font-medium rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Produk Baru
          </Button>
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

      {/* Products List */}
      <div className="px-4 space-y-3">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock);
          
          return (
            <Card key={product.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {product.image && (
                      <div className="w-12 h-12 rounded bg-gray-100 mr-3 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Rp {product.price.toLocaleString('id-ID')}
                        {product.barcode && <span className="ml-2 text-xs text-gray-400">({product.barcode})</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="secondary" 
                      className={`${stockStatus.color} text-white text-xs px-2 py-1`}
                    >
                      {stockStatus.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Stok: {product.stock}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  className="ml-4"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
        
        {filteredProducts.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
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

      {/* Modals */}
      <AddProductModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onAddProduct={handleAddProduct}
      />
      
      {selectedProduct && (
        <EditProductModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)}
          product={selectedProduct}
          onSave={handleProductUpdate}
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

export default StockView;
