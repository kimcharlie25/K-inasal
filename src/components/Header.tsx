import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useCategories } from '../hooks/useCategories';
import { useTable } from '../contexts/TableContext';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onCategoryClick?: (categoryId: string) => void;
  selectedCategory?: string;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick, onCategoryClick, selectedCategory }) => {
  const { siteSettings, loading } = useSiteSettings();
  const { categories, loading: categoriesLoading } = useCategories();
  const { tableNumber } = useTable();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-2 text-[#FF0000] hover:opacity-80 transition-opacity duration-200"
          >
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt={siteSettings?.site_name || "Beracah Cafe"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <h1 className="text-2xl font-sans font-bold text-[#FF0000]">
              {loading ? (
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
              ) : (
                siteSettings?.site_name || "Beracah Cafe"
              )}
            </h1>
          </button>
          
          <nav className="hidden md:flex items-center space-x-8">
            {categoriesLoading ? (
              <div className="flex space-x-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onCategoryClick?.('all')}
                  className={`transition-colors duration-200 font-sans ${
                    selectedCategory === 'all' || !selectedCategory
                      ? 'text-[#FF0000] font-semibold'
                      : 'text-gray-700 hover:text-[#FF0000]'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategoryClick?.(category.id)}
                    className={`flex items-center space-x-1 transition-colors duration-200 font-sans ${
                      selectedCategory === category.id
                        ? 'text-[#FF0000] font-semibold'
                        : 'text-gray-700 hover:text-[#FF0000]'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {tableNumber && (
              <div className="px-3 py-2 bg-black text-white rounded-lg text-sm font-semibold font-sans">
                Table #{tableNumber}
              </div>
            )}
            <button 
              onClick={onCartClick}
              className="relative p-2 bg-black text-white hover:bg-gray-800 rounded-full transition-all duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;