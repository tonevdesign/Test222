'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Липсва токен за потвърждение');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setStatus('loading');
      const response = await apiClient.post<{ message: string }>('/auth/verify-email', {
        token: verificationToken,
      });

      setStatus('success');
      setMessage(response.data?.message || 'Имейлът е потвърден успешно!');

      setTimeout(() => {
        router.push('/account?verified=true');
      }, 3000);
    } catch (error: unknown) {
      setStatus('error');
      
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setMessage((error as { response: { data: { message: string } } }).response.data.message);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Неуспешно потвърждение на имейла');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md"
      >
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 sm:gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#00BFA6] to-[#00897B] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl sm:text-2xl">Z</span>
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] tracking-tight">Zekto</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center"
        >
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#00BFA6]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Loader2 size={28} className="sm:w-8 sm:h-8 text-[#00BFA6] animate-spin" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
                Потвърждаване на имейл...
              </h1>
              <p className="text-sm sm:text-base text-[#777777]">
                Моля, изчакайте докато потвърдим вашия имейл адрес.
              </p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 
                }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
              >
                <CheckCircle size={32} className="sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
                Имейлът е потвърден!
              </h1>
              <p className="text-sm sm:text-base text-[#777777] mb-4 sm:mb-6">
                {message || 'Вашият имейл адрес е потвърден успешно. Пренасочваме ви...'}
              </p>
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#777777]">
                <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin text-[#00BFA6]" />
                <span>Пренасочване след 3 секунди...</span>
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <XCircle size={32} className="sm:w-10 sm:h-10 text-red-600" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
                Неуспешно потвърждение
              </h1>
              <p className="text-sm sm:text-base text-[#777777] mb-4 sm:mb-6">
                {message || 'Този линк за потвърждение е невалиден или е изтекъл.'}
              </p>
              
              <div className="space-y-2.5 sm:space-y-3">
                <Link href="/account">
                  <Button size="lg" className="w-full">
                    Към акаунта
                  </Button>
                </Link>
                
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full">
                    Вход в акаунт
                  </Button>
                </Link>
              </div>
            </>
          )}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-center mt-4 sm:mt-6"
        >
          <Link
            href="/"
            className="text-[#777777] hover:text-[#00BFA6] transition-colors text-xs sm:text-sm"
          >
            ← Обратно към началната страница
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <VerifyEmailContent />
    </Suspense>
  );
}