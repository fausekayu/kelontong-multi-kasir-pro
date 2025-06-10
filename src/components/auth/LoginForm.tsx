
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string, role: 'cashier' | 'owner') => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

const LoginForm = ({ onLogin, onForgotPassword, onSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'cashier' | 'owner'>('cashier');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin(email, password, role);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <div className="mt-1 relative">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukkan email anda"
              className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
              required
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <div className="mt-1 relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="masukkan password anda"
              className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary rounded-xl"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="role" className="text-sm font-medium text-foreground">
            Role
          </Label>
          <Select value={role} onValueChange={(value: 'cashier' | 'owner') => setRole(value)}>
            <SelectTrigger className="h-12 border-gray-200 focus:border-primary focus:ring-primary rounded-xl mt-1">
              <SelectValue placeholder="Pilih role anda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashier">Kasir</SelectItem>
              <SelectItem value="owner">Pemilik Toko</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-apple"
      >
        {isLoading ? 'Masuk...' : 'Masuk'}
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Lupa Password?
        </button>
        <button
          type="button"
          onClick={onSignUp}
          className="text-primary hover:text-primary/80 font-medium"
        >
          Daftar Akun
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
