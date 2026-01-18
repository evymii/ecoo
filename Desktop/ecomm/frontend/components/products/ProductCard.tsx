'use client';

import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { useState } from 'react';
import { getImageUrl } from '@/lib/image-utils';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: Array<{ url: string; isMain: boolean }>;
  features: {
    isNew: boolean;
    isFeatured: boolean;
    isDiscounted: boolean;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: mainImage?.url,
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        {mainImage ? (
          <Image
            src={getImageUrl(mainImage.url)}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Зураг байхгүй</span>
          </div>
        )}
        <button className="absolute top-1.5 right-1.5 md:top-2 md:right-2 p-1.5 md:p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          <Heart className="w-3 h-3 md:w-4 md:h-4" />
        </button>
        {product.features.isDiscounted && (
          <span className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-red-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded">
            Хямдарсан
          </span>
        )}
      </div>
      
      <div className="p-2.5 md:p-4">
        <h3 className="font-medium text-xs md:text-base mb-1.5 md:mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-base md:text-xl font-semibold mb-2 md:mb-3">
          ₮{product.price.toLocaleString()}
        </p>
        
        <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border rounded hover:bg-gray-100 text-xs md:text-sm"
          >
            -
          </button>
          <span className="flex-1 text-center text-xs md:text-base">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center border rounded hover:bg-gray-100 text-xs md:text-sm"
          >
            +
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full text-[10px] md:text-sm h-8 md:h-9"
          size="sm"
        >
          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          Сагсанд нэмэх
        </Button>
      </div>
    </div>
  );
}
