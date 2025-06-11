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

const StockView = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Indomie Goreng",
      price: 3500,
      stock: 100,
      category: "Makanan",
      sku: "IND-GRG-001",
      barcode: "896861000308",
      image: "https://down-id.img.susercontent.com/file/625aa1c9929414619c17060a509757ca"
    },
    {
      id: "PRD-002",
      name: "Aqua 600ml",
      price: 5000,
      stock: 150,
      category: "Minuman",
      sku: "AQU-600-001",
      barcode: "8992741140029",
      image: "https://www.static-src.com/wcsstore/IDCAS/Attachment/MTA4NjY4Njg4/1_full01.jpg"
    },
    {
      id: "PRD-003",
      name: "Coca Cola 330ml",
      price: 6000,
      stock: 80,
      category: "Minuman",
      sku: "COC-330-001",
      barcode: "5449000000996",
      image: "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2023/4/18/4c9e9c3a-5854-4792-a7cd-59bb24c7954f.png"
    },
    {
      id: "PRD-004",
      name: "Beras Cap Jago 5kg",
      price: 65000,
      stock: 50,
      category: "Sembako",
      sku: "BRS-CJG-5KG",
      barcode: "8997014300020",
      image: "https://images.klikindomaret.com/products/10041444.jpg"
    },
    {
      id: "PRD-005",
      name: "Minyak Goreng Bimoli 1L",
      price: 25000,
      stock: 60,
      category: "Sembako",
      sku: "MG-BIM-1L",
      barcode: "8992691000129",
      image: "https://images.tokopedia.net/img/cache/700/product-1/2020/2/28/1777198/1777198_8239a7c9-4a4c-498a-a456-01939379c498_640_640"
    },
    {
      id: "PRD-006",
      name: "Susu Ultra Milk Cokelat 200ml",
      price: 5500,
      stock: 120,
      category: "Minuman",
      sku: "SUS-ULT-CKL-200",
      barcode: "8992955211213",
      image: "https://images.klikindomaret.com/products/10041248.jpg"
    },
    {
      id: "PRD-007",
      name: "Teh Botol Sosro",
      price: 7000,
      stock: 90,
      category: "Minuman",
      sku: "TEH-SOS-001",
      barcode: "8995002001024",
      image: "https://www.static-src.com/wcsstore/IDCAS/Attachment/MTAwMDQzOTQz/1_full01.jpg"
    },
    {
      id: "PRD-008",
      name: "Gula Pasir Gulaku 1kg",
      price: 18000,
      stock: 70,
      category: "Sembako",
      sku: "GUL-GLK-1KG",
      barcode: "8997021100014",
      image: "https://images.klikindomaret.com/products/10041447.jpg"
    },
    {
      id: "PRD-009",
      name: "Sabun Mandi Lifebuoy",
      price: 4000,
      stock: 110,
      category: "Kebersihan",
      sku: "SAB-LFB-001",
      barcode: "8999909014782",
      image: "https://www.static-src.com/wcsstore/IDCAS/Attachment/MTAwMDQ0Mjkz/1_full01.jpg"
    },
    {
      id: "PRD-010",
      name: "Shampo Clear Men",
      price: 28500,
      stock: 40,
      category: "Kebersihan",
      sku: "SHM-CLR-MEN",
      barcode: "8999999067062",
      image: "https://s3.bukalapak.com/img/34349489452/s-461-461/data.png"
    },
  ]);

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
      return { label: 'Cukup', variant: 'default' };
    } else if (stock > 10) {
      return { label: 'Hampir Habis', variant: 'secondary' };
    } else {
      return { label: 'Habis', variant: 'destructive' };
    }
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: `PRD-${Date.now()}`
    };
    setProducts([...products, product]);
    setShowAddModal(false);
    toast({
      title: "Produk Ditambahkan",
      description: `${product.name} berhasil ditambahkan ke inventori.`,
    });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
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
        onSubmit={handleAddProduct}
      />

      {editingProduct && (
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditProduct}
          product={editingProduct}
        />
      )}

      {showScanner && (
        <BarcodeScanner
          isOpen={showScanner}
          onClose={() => setShowScanner(false)}
          onScan={handleScanResult}
        />
      )}
    </div>
  );
};

export default StockView;
