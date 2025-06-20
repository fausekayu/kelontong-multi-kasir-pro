
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, QrCode, Check, Printer, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onPaymentComplete: (paymentMethod: string) => void;
}

const CheckoutModal = ({ isOpen, onClose, cart, onPaymentComplete }: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'debit'>('cash');
  const [cashAmount, setCashAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiptPrinted, setReceiptPrinted] = useState(false);
  const { toast } = useToast();

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  const change = parseFloat(cashAmount) - total;
  const hasEnoughCash = parseFloat(cashAmount) >= total;
  
  const handleProcess = () => {
    if (paymentMethod === 'cash' && !hasEnoughCash) {
      toast({
        title: "Pembayaran Gagal",
        description: "Jumlah uang tidak cukup",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };
  
  const handlePrintReceipt = () => {
    setIsPrintingReceipt(true);
    
    // Simulate receipt printing
    setTimeout(() => {
      setIsPrintingReceipt(false);
      setReceiptPrinted(true);
      toast({
        title: "Struk Dicetak",
        description: "Struk pembayaran telah berhasil dicetak"
      });
    }, 2000);
  };
  
  const handleComplete = () => {
    onPaymentComplete(
      paymentMethod === 'cash' 
        ? 'Tunai' 
        : paymentMethod === 'qris' 
          ? 'QRIS' 
          : 'Kartu Debit'
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('id-ID');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
        </DialogHeader>
        
        {showSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <Check className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Pembayaran Berhasil</h3>
            <p className="text-muted-foreground text-center mb-6">
              {isPrintingReceipt 
                ? 'Mencetak struk pembayaran...'
                : 'Transaksi telah selesai'}
            </p>
            
            {!isPrintingReceipt && (
              <>
                {!receiptPrinted ? (
                  <Button 
                    className="w-full gradient-primary mb-4"
                    onClick={handlePrintReceipt}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Struk
                  </Button>
                ) : (
                  <div className="w-full bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                    <div className="text-center mb-3">
                      <h4 className="font-bold">WARLONTAR</h4>
                      <p className="text-xs text-gray-500">Jl. Raya Bogor No. 456, Depok</p>
                      <p className="text-xs text-gray-500">Telp: 02187654321</p>
                    </div>
                    
                    <div className="text-xs mb-3 flex justify-between">
                      <span>{getCurrentDate()}</span>
                      <span>{getCurrentTime()}</span>
                    </div>
                    
                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                    
                    {cart.map((item, idx) => (
                      <div key={idx} className="text-sm flex justify-between mb-1">
                        <div>
                          <div>{item.name} x{item.quantity}</div>
                          <div className="text-xs text-gray-500">@{formatCurrency(item.price)}</div>
                        </div>
                        <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                    
                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                    
                    <div className="text-sm flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="text-sm flex justify-between">
                      <span>PPN (10%):</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="text-sm font-bold flex justify-between mt-1">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                    
                    <div className="text-sm flex justify-between">
                      <span>Metode Pembayaran:</span>
                      <span>
                        {paymentMethod === 'cash' ? 'Tunai' : paymentMethod === 'qris' ? 'QRIS' : 'Kartu Debit'}
                      </span>
                    </div>
                    
                    {paymentMethod === 'cash' && cashAmount && (
                      <>
                        <div className="text-sm flex justify-between">
                          <span>Dibayar:</span>
                          <span>{formatCurrency(parseFloat(cashAmount))}</span>
                        </div>
                        <div className="text-sm flex justify-between">
                          <span>Kembali:</span>
                          <span>{formatCurrency(change)}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                    
                    <div className="text-center text-xs">
                      <p>Terima kasih atas kunjungan Anda</p>
                      <p>Simpan struk ini sebagai bukti pembayaran</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={handleComplete}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Selesai
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div className="mb-4">
              <h3 className="font-medium mb-3">Ringkasan Order</h3>
              <div className="max-h-60 overflow-y-auto">
                {cart.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between py-2 ${
                      index !== cart.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="font-medium">{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">PPN (10%)</p>
                  <p className="font-medium">{formatCurrency(tax)}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-100">
                  <p className="font-bold">Total</p>
                  <p className="font-bold text-primary text-lg">{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <Tabs 
              defaultValue="cash"
              onValueChange={(val) => setPaymentMethod(val as 'cash' | 'qris' | 'debit')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="cash" className="flex items-center">
                  <Banknote className="w-4 h-4 mr-2" />
                  <span>Tunai</span>
                </TabsTrigger>
                <TabsTrigger value="qris" className="flex items-center">
                  <QrCode className="w-4 h-4 mr-2" />
                  <span>QRIS</span>
                </TabsTrigger>
                <TabsTrigger value="debit" className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>Debit</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cash">
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cash-amount">Jumlah Uang</Label>
                      <Input
                        id="cash-amount"
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        placeholder="Masukkan jumlah uang"
                        className="mt-1"
                      />
                    </div>
                    
                    {cashAmount && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <span>Kembalian:</span>
                          <span className={`font-bold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? formatCurrency(change) : `Kurang ${formatCurrency(Math.abs(change))}`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="qris">
                <Card className="p-4 text-center">
                  <div className="bg-gray-100 p-6 rounded-lg mb-4 mx-auto w-48 h-48 flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-primary" />
                  </div>
                  <p className="text-sm mb-1">Scan QR Code di atas untuk membayar</p>
                  <p className="font-semibold text-primary">{formatCurrency(total)}</p>
                </Card>
              </TabsContent>
              
              <TabsContent value="debit">
                <Card className="p-4 text-center">
                  <div className="bg-gray-100 p-6 rounded-lg mb-4 flex justify-center">
                    <CreditCard className="w-20 h-20 text-primary" />
                  </div>
                  <p className="text-sm mb-3">Silakan gunakan mesin EDC untuk melakukan pembayaran</p>
                  <p className="font-semibold text-primary">{formatCurrency(total)}</p>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {!showSuccess && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Batalkan
            </Button>
            <Button 
              className="flex-1 gradient-primary"
              onClick={handleProcess} 
              disabled={isProcessing || (paymentMethod === 'cash' && (!cashAmount || !hasEnoughCash))}
            >
              {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
