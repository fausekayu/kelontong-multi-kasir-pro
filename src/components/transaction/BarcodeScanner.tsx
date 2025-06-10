
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scan, Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

const BarcodeScanner = ({ isOpen, onClose, onBarcodeScanned }: BarcodeScannerProps) => {
  const [manualBarcode, setManualBarcode] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if browser supports camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          setHasCamera(true);
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(() => {
          setHasCamera(false);
        });
    }
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode) {
      onBarcodeScanned(manualBarcode);
    }
  };

  // In a real app, we'd integrate with a library like quagga.js for barcode scanning
  // This is just a simulation

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Scan Barcode</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {/* Camera View (in a real app, this would be a live camera feed) */}
        {hasCamera && (
          <div className="mb-6">
            <div className="border border-dashed border-primary aspect-video bg-gray-50 rounded-lg flex flex-col items-center justify-center">
              <Camera className="w-16 h-16 text-gray-300 mb-2" />
              <p className="text-muted-foreground text-center px-4">
                Simulasi kamera. Di aplikasi nyata, ini akan menampilkan kamera untuk scan barcode.
              </p>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button
                className="gradient-primary"
                onClick={() => {
                  // Simulate a successful scan with a random barcode
                  const demoBarcode = `8998888${Math.floor(100000 + Math.random() * 900000).toString()}`;
                  onBarcodeScanned(demoBarcode);
                }}
              >
                <Scan className="w-4 h-4 mr-2" />
                Simulasi Scan
              </Button>
            </div>
          </div>
        )}
        
        {/* Manual Input */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <Label htmlFor="manual-barcode">Input Manual Barcode</Label>
            <Input
              id="manual-barcode"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Contoh: 8998888123456"
              className="mt-1"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={!manualBarcode} 
            className="w-full"
          >
            Cari Produk
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
