'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

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
  category: string;
}

const categories = [
  'Бүх бараа',
  'Бичиг хэрэг',
  'Утасны дагалдах',
  'Тоглоом',
  'Гэр ахуй',
  'Цахилгаан бараа',
  'Жааз',
  'Бэлэг дурсгал',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Бүх бараа');
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Redirect admin users to admin pages
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/orders');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedCategory === 'Бүх бараа') {
          response = await api.get('/products');
        } else {
          response = await api.get(`/products/category/${selectedCategory}`);
        }
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <h1 className="text-xl md:text-3xl font-semibold md:font-bold mb-3 md:mb-4">
          Бүх бараа
        </h1>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs md:text-sm whitespace-nowrap h-7 md:h-9"
            >
              {category}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12 text-sm md:text-base">Ачааллаж байна...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-xs md:text-sm text-gray-400">
            Бараа олдсонгүй
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
