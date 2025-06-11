
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartSummaryProps {
  cart: CartItem[];
  onCheckout: () => void;
  onClearCart?: () => void;
  onRemoveItem?: (id: string) => void;
}

const CartSummary = ({ cart, onCheckout, onClearCart, onRemoveItem }: CartSummaryProps) => {
  const [showCartDetails, setShowCartDetails] = useState(false);
  const { toast } = useToast();
  
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <Card className="sticky top-20 z-40 mx-4 mb-4 bg-white/95 backdrop-blur-md border-blue-200 shadow-apple-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative cursor-pointer" onClick={() => setShowCartDetails(!showCartDetails)}>
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-apple">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                {cartItemCount}
              </Badge>
            </div>
            <div>
              <p className="font-semibold text-foreground">Keranjang Belanja</p>
              <p className="text-sm text-muted-foreground">
                {cartItemCount} item • Rp {cartTotal.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Menu Keranjang">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onClearCart} className="text-red-500">
                  Kosongkan Keranjang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={onCheckout}
              className="gradient-primary text-white px-6 py-3 rounded-xl shadow-apple hover:opacity-90 transition-all duration-200"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Bayar
            </Button>
          </div>
        </div>
        
        {/* Cart Details */}
        {showCartDetails && (
          <div className="mt-4 border-t border-gray-100 pt-4 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                  {onRemoveItem && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CartSummary;
