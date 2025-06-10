
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-6 shadow-apple-lg">
            <span className="text-2xl font-bold text-white">POS</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-apple-lg border border-white/20 p-8">
          {children}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Sistem Kasir Multi-Toko © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
