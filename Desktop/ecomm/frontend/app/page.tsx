'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProductSection from '@/components/home/ProductSection';
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
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
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
        const [featuredRes, discountedRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/discounted'),
        ]);
        setFeaturedProducts(featuredRes.data.products || []);
        setDiscountedProducts(discountedRes.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {loading ? (
          <div className="text-center py-8 md:py-12 text-sm md:text-base">Ачааллаж байна...</div>
        ) : (
          <>
            <ProductSection
              title="Шинэ / Онцлох бараа"
              products={featuredProducts}
              link="/products?filter=featured"
            />
            <ProductSection
              title="Хямдарсан бараа"
              products={discountedProducts}
              link="/products?filter=discounted"
            />
          </>
        )}
      </main>
    </div>
  );
}
