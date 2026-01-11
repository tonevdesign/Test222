'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface EmailVerificationModalProps {
  onClose: () => void;
}

export default function EmailVerificationModal({ onClose }: EmailVerificationModalProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useAuth();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Токенът за потвърждение липсва');
      return;
    }

    const verifyEmail = async () => {
      try {
        
        setStatus('success');
        setMessage('Имейлът е променен успешно!');
        
        // Refresh user data
        await fetchUser();
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/account/profile');
          onClose();
        }, 2000);
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Невалиден или изтекъл токен за потвърждение'
        );
      }
    };

    verifyEmail();
  }, [token, fetchUser, router, onClose]);

  const handleClose = () => {
    router.push('/account/profile');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
        >
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-[#00BFA6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 size={32} className="text-[#00BFA6] animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
                  Потвърждаване...
                </h2>
                <p className="text-[#777777]">
                  Моля, изчакайте докато потвърдим вашия имейл адрес
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
                  Успешно!
                </h2>
                <p className="text-[#777777] mb-6">
                  {message}
                </p>
                <p className="text-sm text-[#777777]">
                  Пренасочване към профила...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
                  Грешка
                </h2>
                <p className="text-[#777777] mb-6">
                  {message}
                </p>
                <Button
                  onClick={handleClose}
                  size="lg"
                  className="w-full"
                >
                  Затвори
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}