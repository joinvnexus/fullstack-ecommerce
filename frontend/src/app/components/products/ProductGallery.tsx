'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageData {
  url: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ImageData[];
  title: string;
  className?: string;
}

const ProductGallery = ({ images, title, className }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  if (!images?.length) {
    return (
      <div className={cn("relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center", className)}>
        <div className="text-gray-400 text-center">
          <ZoomIn size={48} className="mx-auto mb-2" />
          <div>No images available</div>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main image container */}
      <div
        className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-white shadow-lg group cursor-zoom-in"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].alt || title}
          fill
          className={cn(
            "object-contain p-4 transition-transform duration-300",
            isZoomed ? "scale-150" : "scale-100"
          )}
          style={{
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={handlePrevious}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={handleNext}
            >
              <ChevronRight size={20} />
            </Button>
          </>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <ZoomIn size={14} />
          <span>Hover to zoom</span>
        </div>
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "flex-shrink-0 relative w-20 h-20 rounded overflow-hidden border-2 transition-all",
                selectedImage === index
                  ? "border-blue-600 shadow-md"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image counter */}
      <div className="text-center text-sm text-gray-600">
        {selectedImage + 1} of {images.length}
      </div>
    </div>
  );
};

export default ProductGallery;