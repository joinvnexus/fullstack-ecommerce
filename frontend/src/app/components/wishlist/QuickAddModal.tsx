'use client';

import { useState } from 'react';
import { X, Heart, Plus, Check } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

interface QuickAddModalProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuickAddModal = ({
  productId,
  productName,
  isOpen,
  onClose,
  onSuccess,
}: QuickAddModalProps) => {
  const { 
    wishlists, 
    defaultWishlist, 
    addToWishlist, 
    createWishlist,
    isProductInWishlist 
  } = useWishlist();
  
  const [selectedWishlistId, setSelectedWishlistId] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedWishlistId && !isCreatingNew) return;

    setIsSubmitting(true);
    
    try {
      let targetWishlistId = selectedWishlistId;
      
      // Create new wishlist if needed
      if (isCreatingNew) {
        if (!newWishlistName.trim()) {
          alert('Please enter a wishlist name');
          return;
        }
        
        // In real implementation, create wishlist and get ID
        // For now, use default wishlist
        targetWishlistId = defaultWishlist?._id || '';
      }

      await addToWishlist(targetWishlistId, productId, notes);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        onSuccess?.();
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      alert('Failed to add to wishlist');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedWishlistId('');
    setIsCreatingNew(false);
    setNewWishlistName('');
    setNotes('');
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Check if product is already in any wishlist
  const alreadyInWishlists = wishlists
    .filter(wishlist => 
      wishlist.items.some(item => item.productId._id === productId)
    )
    .map(wishlist => wishlist.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold">Add to Wishlist</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Product info */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900">{productName}</h4>
              <p className="text-sm text-gray-600">
                Select a wishlist or create a new one
              </p>
              
              {/* Already in wishlist warning */}
              {alreadyInWishlists.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Already in: {alreadyInWishlists.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Success message */}
            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">
                  Added to Wishlist!
                </h4>
                <p className="mt-2 text-gray-600">
                  {productName} has been added to your wishlist.
                </p>
              </div>
            ) : (
              <>
                {/* Existing wishlists */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Wishlist
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {wishlists.map((wishlist) => (
                      <label
                        key={wishlist._id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                          selectedWishlistId === wishlist._id && !isCreatingNew
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="wishlist"
                          value={wishlist._id}
                          checked={selectedWishlistId === wishlist._id && !isCreatingNew}
                          onChange={() => {
                            setSelectedWishlistId(wishlist._id);
                            setIsCreatingNew(false);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium">{wishlist.name}</div>
                          <div className="text-sm text-gray-500">
                            {wishlist.items.length} items
                            {wishlist.isDefault && ' • Default'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Create new wishlist option */}
                <div className="mb-6">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:border-gray-400">
                    <input
                      type="radio"
                      name="wishlist"
                      checked={isCreatingNew}
                      onChange={() => setIsCreatingNew(true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Plus size={18} className="text-gray-500 mr-2" />
                      <span className="font-medium">Create new wishlist</span>
                    </div>
                  </label>

                  {isCreatingNew && (
                    <div className="mt-3 ml-7">
                      <input
                        type="text"
                        value={newWishlistName}
                        onChange={(e) => setNewWishlistName(e.target.value)}
                        placeholder="Enter wishlist name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note about this item..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            {success ? (
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700"
              >
                Done
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!selectedWishlistId && !isCreatingNew)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Add to Wishlist'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddModal;