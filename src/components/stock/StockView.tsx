
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Edit, 
  Package,
  ScanLine,
  Filter
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  sku: string;
  barcode: string;
  image?: string;
}

interface StockViewProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

const StockView = ({ products, onUpdateProducts }: StockViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const categoryMatch = filterCategory === 'all' || product.category === filterCategory;
    return searchRegex.test(product.name) && categoryMatch;
  });

  const getStockStatus = (stock: number) => {
    if (stock > 50) {
      return { label: 'Banyak', variant: 'default' as const };
    } else if (stock > 10) {
      return { label: 'Normal', variant: 'secondary' as const };
    } else if (stock > 0) {
      return { label: 'Sedikit', variant: 'destructive' as const };
    } else {
      return { label: 'Habis', variant: 'destructive' as const };
    }
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `PRD-${Date.now()}`
    };
    const updatedProducts = [...products, product];
    onUpdateProducts(updatedProducts);
    setShowAddModal(false);
    toast({
      title: "Produk Ditambahkan",
      description: `${product.name} berhasil ditambahkan ke inventori.`,
    });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    onUpdateProducts(updatedProducts);
    setShowEditModal(false);
    setEditingProduct(null);
    toast({
      title: "Produk Diperbarui",
      description: `${updatedProduct.name} berhasil diperbarui.`,
    });
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleScanResult = (result: string) => {
    const foundProduct = products.find(p => p.barcode === result);
    if (foundProduct) {
      openEditModal(foundProduct);
      toast({
        title: "Produk Ditemukan",
        description: `${foundProduct.name} ditemukan untuk diedit.`,
      });
    } else {
      toast({
        title: "Produk Tidak Ditemukan",
        description: "Barcode tidak ditemukan dalam inventori.",
        variant: "destructive"
      });
    }
    setShowScanner(false);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold">Inventori Produk</h2>
        <Button onClick={() => setShowAddModal(true)} className="gradient-primary text-white shadow-apple">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Controls */}
      <div className="px-4 flex items-center space-x-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shadow-apple">
              <Filter className="w-4 h-4 mr-2" />
              Kategori
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {categories.map(category => (
              <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                {category === 'all' ? 'Semua Kategori' : category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="shadow-apple" onClick={() => setShowScanner(true)}>
          <ScanLine className="w-4 h-4 mr-2" />
          Scan Barcode
        </Button>
      </div>
      
      {/* Product Grid */}
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditModal(product)}>
                      Edit Produk
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <Package className="w-4 h-4 mr-1 inline-block" />
                  Stok: {product.stock} <Badge variant={getStockStatus(product.stock).variant}>{getStockStatus(product.stock).label}</Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                  Kategori: {product.category}
                </p>
                <p className="text-sm font-medium">
                  Harga: Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />

      {editingProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProduct}
          product={editingProduct}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onResult={handleScanResult}
        />
      )}
    </div>
  );
};

export default StockView;
