'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Паролите не съвпадат",
    path: ['confirm_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
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
        setError('Something went wrong');
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
              <CheckCircle size={28} className="sm:w-8 sm:h-8 text-[#00BFA6]" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
              Паролата е нулирана успешно
            </h1>
            <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
              Паролата ви беше нулирана успешно. Сега можете да влезете с новата си парола.
            </p>

            <Link href="/login">
              <Button size="lg" className="w-full">
                Вход
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[340px] xs:max-w-sm sm:max-w-md"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-2">
              Невалиден линк за нулиране
            </h1>
            <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
              Този линк за нулиране на парола е невалиден или е изтекъл. Моля, поискайте нов.
            </p>
            <Link href="/forgot-password">
              <Button size="lg" className="w-full">
                Поискай нов линк
              </Button>
            </Link>
          </div>
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
            Нулиране на парола
          </h1>
          <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
            Въведете новата си парола по-долу
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
            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Нова парола"
                  error={errors.password?.message}
                  icon={<Lock size={18} />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 sm:right-3 top-[38px] sm:top-[42px] text-[#777777] hover:text-[#00BFA6] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="relative">
                <Input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Потвърдете новата парола"
                  error={errors.confirm_password?.message}
                  icon={<Lock size={18} />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 sm:right-3 top-[38px] sm:top-[42px] text-[#777777] hover:text-[#00BFA6] transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Нулиране на парола
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="text-center mt-4 sm:mt-6"
        >
          <Link
            href="/login"
            className="text-[#777777] hover:text-[#00BFA6] transition-colors text-xs sm:text-sm"
          >
            ← Назад към Вход
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <ResetPasswordContent />
    </Suspense>
  );
}