'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle2, Copy } from 'lucide-react';

type PaymentMethod = 'pay_later' | 'paid_personally' | 'bank_transfer';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const total = useCartStore((state) => state.getTotal());
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
    address: user?.address?.deliveryAddress || '',
    additionalInfo: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_later');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Redirect admin users to admin pages
    if (user?.role === 'admin') {
      router.push('/admin/orders');
      return;
    }
    if (items.length === 0 && !orderSuccess) {
      router.push('/');
    }
  }, [items, orderSuccess, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryAddress: {
          address: formData.address,
          ...(formData.additionalInfo && { additionalInfo: formData.additionalInfo }),
        },
        paymentMethod,
      };

      console.log('Submitting order:', orderData);

      const response = await api.post('/orders', orderData);

      console.log('Order response:', response.data);

      if (response.data.success && response.data.order) {
        setOrderCode(response.data.order.orderCode || response.data.order._id);
        setOrderId(response.data.order._id);
        setOrderSuccess(true);
        clearCart();
        toast({
          title: 'Амжилттай',
          description: 'Захиалга амжилттай үүслээ',
        });
      } else {
        throw new Error('Захиалгын мэдээлэл буруу байна');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Захиалга үүсгэхэд алдаа гарлаа';
      toast({
        title: 'Алдаа',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderCode);
    toast({
      title: 'Хуулагдлаа',
      description: 'Захиалгын код хуулагдлаа',
    });
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-3 md:px-4 py-6 md:py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6 md:p-12">
                <div className="flex flex-col items-center justify-center py-6 md:py-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
                    <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
                  </div>
                  <h1 className="text-xl md:text-3xl font-semibold md:font-bold mb-3 md:mb-4">
                    Захиалга амжилттай
                  </h1>
                  <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 px-2">
                    Таны имэйл хаяг руу #{orderCode} тасалбар амжилттай илгээгдлээ
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 w-full">
                    <p className="text-xs md:text-sm text-gray-600 mb-2">Захиалгын код:</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-lg md:text-xl font-semibold md:font-bold">{orderCode}</p>
                      <button
                        onClick={copyOrderCode}
                        className="p-1.5 md:p-2 hover:bg-gray-200 rounded"
                        title="Хуулах"
                      >
                        <Copy className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
                    <Link href="/profile/orders" className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full sm:w-auto text-xs md:text-sm">
                        Захиалгууд үзэх
                      </Button>
                    </Link>
                    <Link href="/" className="flex-1 sm:flex-none">
                      <Button className="w-full sm:w-auto text-xs md:text-sm">
                        Нүүр хуудас
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4 md:mb-6">
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span className="text-xs md:text-sm">Буцах</span>
        </Link>

        <h1 className="text-xl md:text-3xl font-semibold md:font-bold mb-4 md:mb-8 text-center">
          Захиалга баталгаажуулах
        </h1>

        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Left Column - Customer Information */}
            <Card>
              <CardContent className="p-4 md:p-8">
                <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-6">
                  Захиалагчийн мэдээлэл
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phoneNumber">Утасны дугаар *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      placeholder="9900-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Имэйл хаяг *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Хүргэлтийн хаяг *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Хот, дүүрэг, хороо, орны дугаар гэх мэт"
                    />
                  </div>
                  <div>
                    <Label htmlFor="additionalInfo">Нэмэлт мэдээлэл</Label>
                    <textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                      rows={4}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Бараанд өөрчлөлт оруулах эсэх, нэмэлт хүсэлт гэх мэт"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Order Summary */}
            <Card>
              <CardContent className="p-4 md:p-8">
                <h2 className="text-base md:text-xl font-semibold mb-4 md:mb-6">
                  Бүтээгдэхүүний тоо: {totalQuantity}
                </h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-start pb-4 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm md:text-base mb-1">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ₮{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm md:text-base font-semibold ml-4">
                        ₮{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                    {/* Payment Method Selection */}
                    <div className="mb-4 md:mb-6">
                      <Label className="text-sm md:text-base font-semibold mb-2 md:mb-3 block">
                        Төлбөрийн хэлбэр
                      </Label>
                      <div className="space-y-2 md:space-y-3">
                        <label className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="pay_later"
                            checked={paymentMethod === 'pay_later'}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                          />
                          <span className="text-xs md:text-base">Дараа төлөх</span>
                        </label>
                        <label className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paid_personally"
                            checked={paymentMethod === 'paid_personally'}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                          />
                          <span className="text-xs md:text-base">Биечлэн төлсөн</span>
                        </label>
                        <label className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_transfer"
                            checked={paymentMethod === 'bank_transfer'}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                          />
                          <span className="text-xs md:text-base">Банкны шилжүүлэг</span>
                        </label>
                      </div>

                      {/* Bank Information */}
                      {paymentMethod === 'bank_transfer' && (
                        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs md:text-sm font-semibold mb-2">Банкны мэдээлэл:</p>
                          <div className="text-xs md:text-sm text-gray-700 space-y-1">
                            <p><strong>Банк:</strong> ХААН банк</p>
                            <p><strong>Данс:</strong> 5145544332</p>
                            <p><strong>Эзэмшигч:</strong> AzSouviner</p>
                            <p className="mt-2 text-[10px] md:text-xs text-gray-600">
                              Төлбөрийн ул мөр хуулгаар төлбөр илгээснийг тэмдэглэнэ үү
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-3 md:pt-4 mb-4 md:mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm md:text-lg">Нийт төлөх дүн:</span>
                        <span className="text-lg md:text-2xl font-semibold md:font-bold">
                          ₮{total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-xs md:text-base h-10 md:h-11"
                      disabled={loading}
                    >
                      {loading ? 'Захиалга үүсгэж байна...' : 'Үргэлжлүүлэх'}
                    </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
}
