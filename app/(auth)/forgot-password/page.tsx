'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/auth/forgot-password', data);
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setError('Нещо се обърка. Моля, опитайте отново.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#00BFA6]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail size={28} className="sm:w-8 sm:h-8 text-[#00BFA6]" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
              Проверете имейла си
            </h1>
            <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
              Изпратихме инструкции за нулиране на паролата на Вашия имейл адрес.
              Моля, проверете пощата си и последвайте линка, за да нулирате паролата си.
            </p>

            <Link href="/login">
              <Button size="lg" className="w-full">
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                Обратно към Вход
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md"
      >
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
            Забравена парола
          </h1>
          <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
            Въведете имейл адреса си по-долу и ще Ви изпратим инструкции за нулиране на паролата.
          </p>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-600 text-xs sm:text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Input
                {...register('email')}
                type="email"
                label="Имейл адрес"
                error={errors.email?.message}
                icon={<Mail size={18} />}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {!isLoading && <Send size={18} className="sm:w-5 sm:h-5" />}
                Изпрати линк за нулиране
              </Button>
            </motion.div>
          </form>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-5 sm:mt-6"
          >
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[#00BFA6] hover:text-[#00a08c] font-medium transition-colors text-sm sm:text-base"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              Обратно към Вход
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}