
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Store, Phone, Mail, MapPin, Camera, Settings, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  role: 'cashier' | 'owner';
  currentStore: string;
  stores?: string[];
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface StoreData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface ProfileViewProps {
  currentUser: User;
  onUserUpdate?: (user: User) => void;
  onBack?: () => void;
}

const ProfileView = ({ currentUser, onUserUpdate, onBack }: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser.name,
    email: currentUser.email || 'user@example.com',
    phone: currentUser.phone || '08123456789',
    address: currentUser.address || 'Jl. Merdeka No. 123, Jakarta',
    avatar: currentUser.avatar || ''
  });
  
  const [storeData, setStoreData] = useState<StoreData>({
    name: currentUser.currentStore,
    address: 'Jl. Raya Bogor No. 456, Depok',
    phone: '02187654321',
    email: 'toko@example.com'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    if (onUserUpdate) {
      const updatedUser = {
        ...currentUser,
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        avatar: profileData.avatar
      };
      onUserUpdate(updatedUser);
    }
    
    toast({
      title: "Berhasil",
      description: "Profil berhasil diperbarui"
    });
    
    setIsEditing(false);
  };

  const handleSaveStore = () => {
    if (onUserUpdate && currentUser.role === 'owner') {
      const updatedUser = {
        ...currentUser,
        currentStore: storeData.name
      };
      onUserUpdate(updatedUser);
    }
    
    toast({
      title: "Berhasil",
      description: "Data toko berhasil diperbarui"
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <Card className="mx-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center">
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative">
              <Avatar className="w-20 h-20">
                {profileData.avatar ? (
                  <AvatarImage src={profileData.avatar} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-lg font-semibold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-primary"
                onClick={triggerFileInput}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {currentUser.role === 'owner' ? 'Pemilik Toko' : 'Kasir'}
              </p>
              <p className="text-sm text-primary font-medium">{storeData.name}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Batal' : 'Edit'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <div className="px-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Informasi Pribadi
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                disabled={!isEditing}
                className={!isEditing ? 'bg-gray-50' : ''}
              />
            </div>
            
            {isEditing && (
              <Button 
                onClick={handleSaveProfile}
                className="w-full gradient-primary text-white"
              >
                Simpan Perubahan
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Store Information */}
      <div className="px-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Store className="w-5 h-5 mr-2 text-primary" />
              Informasi Toko
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Nama Toko</Label>
              <Input
                id="storeName"
                value={storeData.name}
                onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                disabled={currentUser.role === 'cashier'}
                className={currentUser.role === 'cashier' ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="storeAddress">Alamat Toko</Label>
              <Input
                id="storeAddress"
                value={storeData.address}
                onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                disabled={currentUser.role === 'cashier'}
                className={currentUser.role === 'cashier' ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="storePhone">Telepon Toko</Label>
              <Input
                id="storePhone"
                value={storeData.phone}
                onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                disabled={currentUser.role === 'cashier'}
                className={currentUser.role === 'cashier' ? 'bg-gray-50' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="storeEmail">Email Toko</Label>
              <Input
                id="storeEmail"
                type="email"
                value={storeData.email}
                onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                disabled={currentUser.role === 'cashier'}
                className={currentUser.role === 'cashier' ? 'bg-gray-50' : ''}
              />
            </div>
            
            {currentUser.role === 'owner' && (
              <Button 
                onClick={handleSaveStore}
                className="w-full gradient-primary text-white"
              >
                Simpan Informasi Toko
              </Button>
            )}
            
            {currentUser.role === 'cashier' && (
              <p className="text-xs text-muted-foreground text-center">
                Hanya pemilik toko yang dapat mengubah informasi toko
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Settings */}
      <div className="px-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Settings className="w-5 h-5 mr-2 text-primary" />
            Pengaturan
          </h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Ubah Password
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Phone className="w-4 h-4 mr-2" />
              Pengaturan Notifikasi
            </Button>
            
            {currentUser.role === 'owner' && (
              <>
                <Button variant="outline" className="w-full justify-start">
                  <Store className="w-4 h-4 mr-2" />
                  Kelola Kasir
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan Diskon
                </Button>
              </>
            )}
            
            <Button variant="destructive" className="w-full justify-start">
              Keluar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
