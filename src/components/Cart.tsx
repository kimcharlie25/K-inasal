import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">☕</div>
          <h2 className="text-2xl font-sans font-bold text-[#FF0000] mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6 font-sans">Add some delicious items to get started!</p>
          <button
            onClick={onContinueShopping}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-sans font-medium"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 self-start"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Continue Shopping</span>
          <span className="sm:hidden">Back</span>
        </button>
        
        <div className="flex items-center justify-between sm:justify-center flex-1">
          <h1 className="text-2xl sm:text-3xl font-sans font-bold text-[#FF0000]">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-[#FF0000] hover:opacity-80 transition-opacity duration-200 text-sm sm:text-base font-sans font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-3">
                  <h3 className="text-base font-sans font-semibold text-black mb-1">{item.name}</h3>
                  {item.selectedVariation && (
                    <p className="text-xs text-gray-500 mb-1">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-gray-500 mb-1">
                      Add-ons: {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-[#FF0000] hover:opacity-80 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 border-2 border-black rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 bg-black text-white hover:bg-gray-800 rounded-l-lg transition-colors duration-200"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-semibold text-black min-w-[32px] text-center text-sm px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 bg-black text-white hover:bg-gray-800 rounded-r-lg transition-colors duration-200"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">₱{item.totalPrice} each</p>
                  <p className="text-lg font-semibold text-black">₱{item.totalPrice * item.quantity}</p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-sans font-semibold text-black mb-1">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-gray-500 mb-1">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1">
                    Add-ons: {item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-lg font-semibold text-black">₱{item.totalPrice} each</p>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-0 border-2 border-black rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 bg-black text-white hover:bg-gray-800 rounded-l-lg transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-semibold text-black min-w-[40px] text-center px-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 bg-black text-white hover:bg-gray-800 rounded-r-lg transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-black">₱{item.totalPrice * item.quantity}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between text-2xl font-sans font-bold text-[#FF0000] mb-6">
          <span>Total:</span>
          <span>₱{(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] font-sans font-medium text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;