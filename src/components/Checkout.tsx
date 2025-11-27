import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Check, Loader2 } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { useOrders } from '../hooks/useOrders';
import { uploadReceiptToCloudinary, compressImage } from '../lib/cloudinary';
import { useTable } from '../contexts/TableContext';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const { createOrder, creating, error } = useOrders();
  const { tableNumber } = useTable();
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [notes, setNotes] = useState('');
  const [uiNotice, setUiNotice] = useState<string | null>(null);
  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Order confirmation modal state
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setUploadError(null);
    setReceiptUrl(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setReceiptUrl(null);
    setUploadError(null);
  };

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleConfirmOrder = async () => {
    let uploadedReceiptUrl = receiptUrl;

    // Upload receipt first if user selected one but hasn't uploaded yet
    if (receiptFile && !receiptUrl) {
      try {
        setUploadingReceipt(true);
        setUploadError(null);
        setUiNotice('Uploading receipt...');

        // Compress image before upload
        const compressedFile = await compressImage(receiptFile, 1200, 0.8);
        
        // Upload to Cloudinary
        uploadedReceiptUrl = await uploadReceiptToCloudinary(compressedFile);
        setReceiptUrl(uploadedReceiptUrl);
        setUiNotice('Receipt uploaded! Creating order...');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload receipt';
        setUploadError(message);
        setUiNotice(`Upload failed: ${message}. Please try again or continue without receipt.`);
        setUploadingReceipt(false);
        return; // Stop order placement if upload fails
      } finally {
        setUploadingReceipt(false);
      }
    }

    // Persist order to database
    try {
      const order = await createOrder({
        customerName,
        contactNumber,
        serviceType: 'dine-in', // Set to dine-in as requested
        paymentMethod,
        notes: notes || undefined,
        total: totalPrice,
        items: cartItems,
        receiptUrl: uploadedReceiptUrl ?? undefined,
        tableNumber: tableNumber ?? undefined,
      });
      
      // Show confirmation modal
      setShowConfirmationModal(true);
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      if (/insufficient stock/i.test(raw)) {
        setUiNotice(raw);
        return;
      }
      if (/rate limit/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else if (/missing identifiers/i.test(raw)) {
        setUiNotice('Too many orders: Please wait 1 minute before placing another order.');
      } else {
        setUiNotice('Failed to create order. Please try again.');
      }
      return;
    }
  };

  const handleModalOkay = () => {
    // Refresh and redirect to landing page
    window.location.href = '/';
  };

  const isDetailsValid = customerName && contactNumber;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 font-sans"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-sans font-bold text-[#FF0000] ml-8">Checkout</h1>
        </div>

        {uiNotice && (
          <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 p-4 text-sm font-sans">
            {uiNotice}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Details Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-sans font-bold text-[#FF0000] mb-6">Customer Information</h2>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-black mb-2 font-sans">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-sans"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2 font-sans">Contact Number *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-sans"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium text-black mb-2 font-sans">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-sans"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-3 font-sans">Payment Method *</label>
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 font-sans ${
                        paymentMethod === method.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-black'
                      }`}
                    >
                      <span className="text-2xl">💳</span>
                      <span className="font-medium">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details with QR Code */}
              {selectedPaymentMethod && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-medium text-black mb-3 font-sans">Payment Details</h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{selectedPaymentMethod.name}</p>
                      <p className="font-mono text-black font-medium">{selectedPaymentMethod.account_number}</p>
                      <p className="text-sm text-gray-600 mb-2">Account Name: {selectedPaymentMethod.account_name}</p>
                      <p className="text-lg font-semibold text-black">Amount: ₱{totalPrice}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <img 
                        src={selectedPaymentMethod.qr_code_url} 
                        alt={`${selectedPaymentMethod.name} QR Code`}
                        className="w-32 h-32 rounded-lg border-2 border-gray-300 shadow-sm"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                        }}
                      />
                      <p className="text-xs text-gray-500 text-center mt-2">Scan to pay</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt Upload */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-black mb-3 font-sans">📸 Upload Payment Receipt (Optional)</h4>
                
                {!receiptPreview ? (
                  <div>
                    <label
                      htmlFor="receipt-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-600 font-sans">
                          <span className="font-semibold">Click to select receipt</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-sans">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                      <input
                        id="receipt-upload"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                        onChange={handleReceiptFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={handleRemoveReceipt}
                        className="absolute top-2 right-2 p-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {receiptUrl ? (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg font-sans">
                        <Check className="h-5 w-5" />
                        <span className="text-sm font-medium">Receipt ready!</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-600 bg-gray-100 px-3 py-2 rounded-lg font-sans">
                        <Upload className="h-5 w-5" />
                        <span className="text-sm font-medium">Receipt selected. Will upload when you confirm order.</span>
                      </div>
                    )}

                    {uploadError && (
                      <div className="text-sm text-[#FF0000] bg-red-50 px-3 py-2 rounded-lg font-sans">
                        {uploadError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-sans font-bold text-[#FF0000] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <h4 className="font-medium text-black font-sans">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-gray-600 font-sans">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-gray-600 font-sans">
                        Add-ons: {item.selectedAddOns.map(addOn => 
                          addOn.quantity && addOn.quantity > 1 
                            ? `${addOn.name} x${addOn.quantity}`
                            : addOn.name
                        ).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 font-sans">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-black font-sans">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center justify-between text-2xl font-sans font-bold text-[#FF0000]">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={!isDetailsValid || creating || uploadingReceipt}
              className={`w-full py-4 rounded-lg font-sans font-medium text-lg transition-all duration-200 transform ${
                !isDetailsValid || creating || uploadingReceipt
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02]'
              }`}
            >
              {uploadingReceipt ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Uploading Receipt...</span>
                </span>
              ) : creating ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Confirming Order...</span>
                </span>
              ) : (
                'Confirm Order'
              )}
            </button>
            {error && !uiNotice && (
              <p className="text-sm text-[#FF0000] text-center mt-2 font-sans">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-sans font-bold text-[#FF0000] mb-4">Order Confirmed!</h3>
              <p className="text-gray-600 mb-6 font-sans">
                Your order has been successfully placed and will be processed shortly.
              </p>
              <button
                onClick={handleModalOkay}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-sans font-medium"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
