'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth-store';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signin', {
        phoneNumber,
        password,
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        setUser({
          ...response.data.user,
          id: response.data.user.id || response.data.user._id
        });
        onOpenChange(false);
        // Clear form
        setPhoneNumber('');
        setPassword('');
        toast({
          title: 'Амжилттай',
          description: 'Нэвтрэх амжилттай',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Алдаа',
        description: error.response?.data?.message || 'Нэвтрэхэд алдаа гарлаа',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        phoneNumber,
        email,
        name,
        password,
      });
      
      if (response.data.success) {
        setToken(response.data.token);
        setUser({
          ...response.data.user,
          id: response.data.user.id || response.data.user._id
        });
        onOpenChange(false);
        // Clear form
        setPhoneNumber('');
        setEmail('');
        setName('');
        setPassword('');
        toast({
          title: 'Амжилттай',
          description: 'Бүртгэл амжилттай',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Алдаа',
        description: error.response?.data?.message || 'Бүртгэл үүсгэхэд алдаа гарлаа',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Бүртгүүлэх' : 'Нэвтрэх'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="name">Нэр / Байгууллагын нэр *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Нэр оруулна уу"
                />
              </div>
              <div>
                <Label htmlFor="email">Имэйл хаяг *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="имэйл@example.com"
                />
              </div>
            </>
          )}
          
          <div>
            <Label htmlFor="phone">Утасны дугаар *</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="99958980"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Нууц үг (4 орон) *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={4}
              pattern="[0-9]{4}"
              placeholder="8980"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Түр хүлээнэ үү...' : isSignUp ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-600 hover:text-black"
          >
            {isSignUp ? 'Аль хэдийн бүртгэлтэй юу? Нэвтрэх' : 'Бүртгэл байхгүй юу? Бүртгүүлэх'}
          </button>
        </div>

        {!isSignUp && (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">эсвэл</p>
            <Button variant="outline" className="w-full">
              Зочноор нэвтрэх
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
