
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CreditCard } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartSummaryProps {
  cart: CartItem[];
  onCheckout: () => void;
}

const CartSummary = ({ cart, onCheckout }: CartSummaryProps) => {
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) return null;

  return (
    <Card className="sticky top-20 z-40 mx-4 mb-4 bg-white/95 backdrop-blur-md border-blue-200 shadow-apple-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
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
          <Button 
            onClick={onCheckout}
            className="gradient-primary text-white px-6 py-3 rounded-xl shadow-apple hover:opacity-90 transition-all duration-200"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Bayar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CartSummary;
