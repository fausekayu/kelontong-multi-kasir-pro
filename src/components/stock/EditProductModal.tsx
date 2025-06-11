
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  barcode?: string;
  image?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSave?: (updatedProduct: Product) => void;
}

const EditProductModal = ({ isOpen, onClose, product, onSave }: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    barcode: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['makanan', 'minuman', 'kebersihan', 'sembako', 'rokok', 'alat-tulis'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        barcode: product.barcode || '',
        image: product.image || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedProduct: Product = {
        ...product,
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        barcode: formData.barcode || undefined,
        image: formData.image || undefined
      };

      // Call onSave handler if provided
      if (onSave) {
        onSave(updatedProduct);
      } else {
        // Default behavior if no callback provided
        toast({
          title: "Berhasil",
          description: "Produk berhasil diperbarui"
        });
      
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui produk",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Produk</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Image */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={triggerFileInput}
              >
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt={formData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full p-1"
                onClick={triggerFileInput}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nama Produk</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama produk"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="Masukkan harga"
              required
            />
          </div>

          <div>
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              placeholder="Masukkan jumlah stok"
              required
            />
          </div>

          <div>
            <Label htmlFor="barcode">Barcode (Opsional)</Label>
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => handleInputChange('barcode', e.target.value)}
              placeholder="Masukkan barcode"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 gradient-primary text-white"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
