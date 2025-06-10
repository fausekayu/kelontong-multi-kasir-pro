
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, AlertTriangle, Package } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const ProductCard = ({ product, cartItem, onAddToCart, onUpdateQuantity }: ProductCardProps) => {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="bg-white border border-gray-100 hover:shadow-apple-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        
        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs font-medium">
              Stok Habis
            </Badge>
          </div>
        )}
        
        {isLowStock && !isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Hampir Habis
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-medium text-foreground mb-1 line-clamp-2 leading-5">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-primary mb-2">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant={isLowStock ? "destructive" : "secondary"} 
              className="text-xs"
            >
              Stok: {product.stock}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {product.category}
            </Badge>
          </div>
        </div>

        {/* Add to Cart or Quantity Controls */}
        {cartItem ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(product.id, cartItem.quantity - 1)}
                className="w-8 h-8 p-0 rounded-full border-primary/20 hover:bg-primary/10"
                disabled={cartItem.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg w-8 text-center">
                {cartItem.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(product.id, cartItem.quantity + 1)}
                className="w-8 h-8 p-0 rounded-full border-primary/20 hover:bg-primary/10"
                disabled={cartItem.quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary">
                Rp {(cartItem.price * cartItem.quantity).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="w-full gradient-primary text-white rounded-xl py-2 font-medium shadow-apple hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock ? (
              'Stok Habis'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Tambah ke Keranjang
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;
