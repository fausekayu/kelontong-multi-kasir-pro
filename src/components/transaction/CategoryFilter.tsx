
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  productCounts?: Record<string, number>;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  productCounts = {}
}: CategoryFilterProps) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const count = productCounts[category] || 0;
        const isSelected = selectedCategory === category;
        
        return (
          <Button
            key={category}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onCategoryChange(category)}
            className={`whitespace-nowrap rounded-full flex items-center space-x-2 ${
              isSelected 
                ? 'gradient-primary text-white shadow-apple' 
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="capitalize">
              {category === 'semua' ? 'Semua' : category}
            </span>
            {count > 0 && (
              <Badge 
                variant={isSelected ? "secondary" : "default"} 
                className={`text-xs ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                }`}
              >
                {count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
