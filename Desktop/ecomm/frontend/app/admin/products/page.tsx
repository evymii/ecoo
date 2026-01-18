'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import AdminNav from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductModal from '@/components/admin/ProductModal';
import api from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-utils';

interface ProductImage {
  url: string;
  isMain: boolean;
  order?: number;
}

interface Product {
  _id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: ProductImage[];
  features: {
    isNew: boolean;
    isFeatured: boolean;
    isDiscounted: boolean;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { isAdmin, isChecking } = useAdminAuth();

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      // Normalize products to ensure images have order property
      const normalizedProducts = (response.data.products || []).map((product: any) => ({
        ...product,
        images: (product.images || []).map((img: any, index: number) => ({
          url: img.url,
          isMain: img.isMain || false,
          order: img.order !== undefined ? img.order : index,
        })),
      }));
      setProducts(normalizedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isChecking) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isChecking]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ барааг устгахдаа итгэлтэй байна уу?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Шалгаж байна...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AdminNav />
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4 md:mb-8">
          <div>
            <h1 className="text-xl md:text-3xl font-semibold md:font-bold mb-1 md:mb-2">
              Барааны удирдлага
            </h1>
            <p className="text-gray-600 text-xs md:text-base">
              Дэлгүүрийн бүх барааг удирдах
            </p>
          </div>
          <Button 
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            size="sm"
            className="w-full md:w-auto"
          >
            Бараа нэмэх
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8 md:py-12 text-sm md:text-base">Ачааллаж байна...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {products.map((product) => {
              const mainImage = product.images.find(img => img.isMain) || product.images[0];
              return (
                <Card key={product._id}>
                  <div className="relative aspect-video">
                    {mainImage ? (
                      <Image
                        src={getImageUrl(mainImage.url)}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Зураг байхгүй</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      {product.features.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Шинэ
                        </span>
                      )}
                      {product.features.isFeatured && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Онцлох
                        </span>
                      )}
                      {product.features.isDiscounted && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Хямдарсан
                        </span>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">Код: {product.code}</p>
                    <h3 className="text-sm md:text-base font-semibold mb-1">{product.category}</h3>
                    <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-base md:text-lg font-semibold md:font-bold mb-2">₮{product.price.toLocaleString()}</p>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                      Нөөц: {product.stock} ширхэг
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="flex-1 text-xs md:text-sm h-8 md:h-9"
                      >
                        Засах
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 text-xs md:text-sm h-8 md:h-9"
                      >
                        Устгах
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <ProductModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          product={editingProduct}
          onSuccess={fetchProducts}
        />
      </main>
    </div>
  );
}
