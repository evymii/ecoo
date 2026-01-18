'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import AdminNav from '@/components/admin/AdminNav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

interface Order {
  _id: string;
  user: {
    name: string;
    phoneNumber: string;
    email?: string;
  };
  items: Array<{
    product: { name: string; price?: number };
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryAddress: {
    address: string;
    additionalInfo?: string;
  };
  paymentMethod?: string;
  orderCode?: string;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { isAdmin, isChecking } = useAdminAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/admin/orders?${params.toString()}`);
      console.log('Fetched orders:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        console.error('Failed to fetch orders:', response.data);
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Алдаа',
        description: error.response?.data?.message || 'Захиалгууд авахад алдаа гарлаа',
        variant: 'destructive',
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isChecking) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isChecking, startDate, endDate]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast({
        title: 'Амжилттай',
        description: 'Захиалгын төлөв шинэчлэгдлээ',
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: 'Алдаа',
        description: error.response?.data?.message || 'Алдаа гарлаа',
        variant: 'destructive',
      });
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
          <h1 className="text-xl md:text-3xl font-semibold md:font-bold">Захиалга</h1>
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-28 md:w-32 text-xs md:text-sm"
            />
            <span className="text-sm">-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-28 md:w-32 text-xs md:text-sm"
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-32 md:w-40 text-xs md:text-sm h-9 md:h-10">
                <SelectValue placeholder="Төлөв өөрчлөх" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх төлөв</SelectItem>
                <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
                <SelectItem value="processing">Бэлтгэж байна</SelectItem>
                <SelectItem value="shipped">Илгээсэн</SelectItem>
                <SelectItem value="delivered">Хүргэсэн</SelectItem>
                <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Ачааллаж байна...</div>
        ) : (
          <Card>
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg font-semibold md:font-bold">
                Захиалгууд ({orders.length} зүйлс)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8 md:py-12 text-sm md:text-base text-gray-500">
                  Захиалга олдсонгүй
                </div>
              ) : (
                <div className="overflow-x-auto -mx-3 md:mx-0">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm">№</th>
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm">ХУДАЛДАН АВАГЧ</th>
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm">ШИРХЭГ</th>
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm hidden md:table-cell">ОГНОО</th>
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm">НИЙТ</th>
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm hidden lg:table-cell">ХҮРГЭХ ХАЯГ</th>
                        <th className="text-left py-2 px-2 md:py-3 md:px-4 font-medium text-xs md:text-sm">ТӨЛӨВ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={order._id} className="border-b">
                          <td className="py-2 px-2 md:py-3 md:px-4">{index + 1}</td>
                          <td className="py-2 px-2 md:py-3 md:px-4">
                            <div className="font-medium">{order.user?.name || '-'}</div>
                            <div className="text-xs text-gray-500">{order.user?.phoneNumber}</div>
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-4">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-4 hidden md:table-cell">
                            {new Date(order.createdAt).toLocaleDateString('mn-MN')}
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-4 font-semibold">
                            ₮{order.total.toLocaleString()}
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-4 hidden lg:table-cell">
                            <div className="text-xs md:text-sm">{order.deliveryAddress?.address || 'Хаяг оруулаагүй'}</div>
                            {order.deliveryAddress?.additionalInfo && (
                              <div className="text-xs text-gray-500 mt-1">
                                {order.deliveryAddress.additionalInfo}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2 md:py-3 md:px-4">
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order._id, value)}
                            >
                              <SelectTrigger className="w-24 md:w-32 h-8 md:h-10 text-xs md:text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Хүлээгдэж буй</SelectItem>
                                <SelectItem value="processing">Бэлтгэж байна</SelectItem>
                                <SelectItem value="shipped">Илгээсэн</SelectItem>
                                <SelectItem value="delivered">Хүргэсэн</SelectItem>
                                <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
