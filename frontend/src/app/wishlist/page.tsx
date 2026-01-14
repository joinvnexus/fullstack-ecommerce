'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  ChevronRight,
  FolderPlus,
  MoreVertical,
  Share2,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import useCartStore from '@/store/cartStore';

const WishlistPage = () => {
  const { user } = useAuth();
const { 
  wishlists, 
  defaultWishlist, 
  isLoading, 
  removeFromWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  moveItem
} = useWishlist();

  
  const { addItem: addToCart } = useCartStore();
  
  const [selectedWishlist, setSelectedWishlist] = useState<string | null>(null);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [editingWishlist, setEditingWishlist] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && wishlists.length > 0 && !selectedWishlist) {
      setSelectedWishlist(defaultWishlist?._id || wishlists[0]?._id);
    }
  }, [user, wishlists, defaultWishlist]);

  const currentWishlist = wishlists.find(w => w._id === selectedWishlist) || defaultWishlist;

  const handleCreateWishlist = async () => {
    if (!newWishlistName.trim()) return;
    
    try {
      await createWishlist(newWishlistName);
      setNewWishlistName('');
      setIsCreatingWishlist(false);
    } catch (error) {
      console.error('Failed to create wishlist:', error);
    }
  };

  const handleUpdateWishlist = async (wishlistId: string) => {
    if (!editName.trim()) return;
    
    try {
      await updateWishlist(wishlistId, { name: editName });
      setEditingWishlist(null);
      setEditName('');
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleDeleteWishlist = async (wishlistId: string) => {
    if (confirm('Are you sure you want to delete this wishlist?')) {
      try {
        await deleteWishlist(wishlistId);
        if (selectedWishlist === wishlistId) {
          setSelectedWishlist(defaultWishlist?._id || wishlists[0]?._id);
        }
      } catch (error) {
        console.error('Failed to delete wishlist:', error);
      }
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      // Show success message
      alert('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleMoveToWishlist = async (productId: string, targetWishlistId: string) => {
    if (!currentWishlist) return;
    
    try {
      await moveItem(currentWishlist._id, targetWishlistId, productId);
    } catch (error) {
      console.error('Failed to move item:', error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!currentWishlist) return;
    
    if (confirm('Remove from wishlist?')) {
      try {
        await removeFromWishlist(currentWishlist._id, productId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const filteredItems = currentWishlist?.items.filter(item => {
    if (!searchTerm) return true;
    
    const product = item.productId;
    return (
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your Wishlist</h2>
            <p className="mt-2 text-gray-600">
              Please login to view and manage your wishlist.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && wishlists.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="lg:col-span-3 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlists</h1>
          <p className="mt-2 text-gray-600">
            Save items you love for later
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Wishlists */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Wishlists</h2>
                <button
                  onClick={() => setIsCreatingWishlist(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Create new wishlist"
                >
                  <FolderPlus size={20} />
                </button>
              </div>

              {/* Create wishlist form */}
              {isCreatingWishlist && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <input
                    type="text"
                    value={newWishlistName}
                    onChange={(e) => setNewWishlistName(e.target.value)}
                    placeholder="Enter wishlist name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateWishlist}
                      className="flex-1 bg-blue-600 text-white py-1 rounded-md text-sm"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingWishlist(false);
                        setNewWishlistName('');
                      }}
                      className="flex-1 border border-gray-300 py-1 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Wishlist list */}
              <div className="space-y-2">
                {wishlists.map((wishlist) => (
                  <div
                    key={wishlist._id}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedWishlist === wishlist._id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedWishlist(wishlist._id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart
                        size={18}
                        className={
                          wishlist.isDefault
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                        }
                      />
                      <div>
                        {editingWishlist === wishlist._id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateWishlist(wishlist._id);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <div className="font-medium">{wishlist.name}</div>
                        )}
                        <div className="text-xs text-gray-500">
                          {wishlist.items.length} items
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingWishlist === wishlist._id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateWishlist(wishlist._id);
                            }}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingWishlist(null);
                              setEditName('');
                            }}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {!wishlist.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingWishlist(wishlist._id);
                                setEditName(wishlist.name);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              Edit
                            </button>
                          )}
                          {!wishlist.isDefault && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteWishlist(wishlist._id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {wishlists.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No wishlists yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content - Wishlist items */}
          <div className="lg:col-span-3">
            {currentWishlist ? (
              <div className="bg-white rounded-lg shadow-md">
                {/* Wishlist header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">{currentWishlist.name}</h2>
                      <p className="text-gray-600">
                        {currentWishlist.items.length} items
                        {currentWishlist.isDefault && ' • Default wishlist'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Share2 size={18} />
                        Share
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Download size={18} />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search and filter */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search in wishlist..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Filter size={18} />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Wishlist items */}
                <div className="p-6">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">
                        {searchTerm ? 'No items found' : 'Wishlist is empty'}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        {searchTerm
                          ? 'Try a different search term'
                          : 'Add items you love to this wishlist'}
                      </p>
                      {!searchTerm && (
                        <Link
                          href="/products"
                          className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Browse Products
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredItems.map((item) => {
                        const product = item?.productId;
                        if (!product || !product.slug) return null;
                        return (
                          <div key={item._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg">
                            {/* Product image */}
                            <div className="flex-shrink-0">
                              <Link href={`/products/${product.slug}`}> 
                                <div className="relative h-32 w-32 rounded-md overflow-hidden">
                                  {product.images?.[0] ? (
                                    <Image
                                      src={product.images[0].url}
                                      alt={product.images[0].alt || product.title}
                                      fill
                                      className="object-cover"
                                      sizes="128px"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-400">No image</span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </div>

                            {/* Product info */}
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                  <Link href={`/products/${product.slug}`}>
                                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                                      {product.title}
                                    </h3>
                                  </Link>
                                  <div className="mt-1 text-gray-600">
                                    ${product.price?.amount?.toFixed(2) || '0.00'}
                                  </div>
                                  <div className={`mt-2 text-sm ${
                                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                  </div>
                                  {item.notes && (
                                    <div className="mt-2 text-sm text-gray-500">
                                      Note: {item.notes}
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleAddToCart(product._id)}
                                    disabled={product.stock === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                  </button>
                                  
                                  {/* Move to dropdown */}
                                  <div className="relative group">
                                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                                      <MoreVertical size={18} />
                                    </button>
                                    <div className="absolute right-0  mt-[-0.2rem] w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                                        Move to...
                                      </div>
                                      {wishlists
                                        .filter(w => w._id !== currentWishlist._id)
                                        .map(wishlist => (
                                          <button
                                            key={wishlist._id}
                                            onClick={() => handleMoveToWishlist(product._id, wishlist._id)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          >
                                            {wishlist.name}
                                          </button>
                                        ))}
                                      <button
                                        onClick={() => handleRemoveItem(product._id)}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t"
                                      >
                                        Remove from Wishlist
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No wishlist selected</h3>
                <p className="mt-2 text-gray-600">
                  Select a wishlist from the sidebar or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;