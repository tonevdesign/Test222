'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types/user';

interface VerifyEmailChangeResponse {
  message: string;
  user?: User;
}


function VerifyEmailChangeContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Токенът за потвърждение липсва');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await apiClient.post<VerifyEmailChangeResponse>('/auth/verify-email-change', { token });
    
        setStatus('success');
        setMessage(response.data?.message || 'Имейлът е променен успешно!');
        
        // Update user in store with returned user data (includes updated email)
        if (response.data?.user) {
          setUser(response.data.user);
        }
        
        // Redirect to profile after 3 seconds
        setTimeout(() => {
          router.push('/account');
        }, 3000);
      } catch (error: any) {
        console.error('❌ Email verification error:', error);
        
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Невалиден или изтекъл токен за потвърждение'
        );
      }
    };

    verifyEmail();
  }, [token, setUser, router]);

  const handleGoToProfile = () => {
    router.push('/account');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-[#00BFA6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 size={40} className="text-[#00BFA6] animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                Потвърждаване на имейл...
              </h1>
              <p className="text-[#777777]">
                Моля, изчакайте докато потвърдим вашия нов имейл адрес
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                Успешно потвърждение!
              </h1>
              <p className="text-[#777777] mb-6">
                {message}
              </p>
              <div className="bg-[#00BFA6]/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-[#00897B] flex items-center justify-center gap-2">
                  <Mail size={16} />
                  <span>Вашият имейл адрес е обновен успешно</span>
                </p>
              </div>
              <p className="text-sm text-[#777777] mb-4">
                Пренасочване към профила след 3 секунди...
              </p>
              <Button
                onClick={handleGoToProfile}
                size="lg"
                className="w-full"
              >
                Към профила
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#1F1F1F] mb-3">
                Грешка при потвърждение
              </h1>
              <p className="text-[#777777] mb-6">
                {message}
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  Този линк може да е изтекъл или невалиден. Моля, опитайте да поискате нова промяна на имейл адреса.
                </p>
              </div>
              <Button
                onClick={handleGoToProfile}
                size="lg"
                variant="outline"
                className="w-full"
              >
                Обратно към профила
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailChangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 size={40} className="text-[#00BFA6] animate-spin" />
      </div>
    }>
      <VerifyEmailChangeContent />
    </Suspense>
  );
}