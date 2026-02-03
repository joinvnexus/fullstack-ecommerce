'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Flag, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onReviewSubmit?: (review: Omit<Review, '_id' | 'createdAt'>) => void;
  className?: string;
}

const ProductReviews = ({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onReviewSubmit,
  className
}: ProductReviewsProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [] as File[]
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const handleRatingClick = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = () => {
    if (!newReview.rating || !newReview.comment.trim()) return;

    const reviewData = {
      userId: 'current-user-id', // Would come from auth
      userName: 'Current User', // Would come from auth
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      images: newReview.images.map(file => URL.createObjectURL(file)),
      helpful: 0,
      verified: true,
    };

    onReviewSubmit?.(reviewData);
    setNewReview({ rating: 0, title: '', comment: '', images: [] });
    setShowReviewForm(false);
  };

  const handleHelpfulVote = (reviewId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  return (
    <div className={cn("space-y-8", className)}>
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <div className="text-gray-600">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {showReviewForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>

          {/* Rating Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(i + 1)}
                  className="transition-colors"
                >
                  <Star
                    size={32}
                    className={
                      i < (hoveredRating || newReview.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title
            </label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Summarize your experience"
            />
          </div>

          {/* Comment Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <Textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full"
              placeholder="Share your thoughts about this product"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Photos
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setNewReview(prev => ({
                  ...prev,
                  images: Array.from(e.target.files || [])
                }))}
                className="hidden"
                id="review-images"
              />
              <label
                htmlFor="review-images"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Camera size={16} />
                Add Photos
              </label>
              {newReview.images.length > 0 && (
                <span className="text-sm text-gray-600">
                  {newReview.images.length} photo{newReview.images.length > 1 ? 's' : ''} selected
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmitReview}
              disabled={!newReview.rating || !newReview.comment.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Review
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No reviews yet</div>
            <p className="text-gray-600">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Flag size={14} />
                </Button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {review.rating} out of 5 stars
                </span>
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
              )}

              {/* Review Comment */}
              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20 rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`Review photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpfulVote(review._id)}
                  className={cn(
                    "flex items-center gap-2",
                    helpfulVotes[review._id] && "text-blue-600"
                  )}
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful + (helpfulVotes[review._id] ? 1 : 0)})
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;