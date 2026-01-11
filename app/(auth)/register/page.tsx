'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const registerSchema = z
  .object({
    first_name: z.string().min(2, 'Името трябва да е поне 2 символа'),
    last_name: z.string().min(2, 'Фамилията трябва да е поне 2 символа'),
    email: z.string().email('Невалиден имейл адрес'),
    password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
    confirm_password: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Трябва да приемете общите условия',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Паролите не съвпадат",
    path: ['confirm_password'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading, error, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      });
      
      setTimeout(() => {
        router.push(redirect);
      }, 300);
    } catch {
      
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
        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-[#1F1F1F] mb-1.5 sm:mb-2">
            Създайте акаунт
          </h1>
          <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
            Присъединете се към нас и започнете да пазарувате днес
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* First Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Input
                {...register('first_name')}
                type="text"
                label="Име"
                error={errors.first_name?.message}
                icon={<User size={18} />}
              />
            </motion.div>

            {/* Last Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Input
                {...register('last_name')}
                type="text"
                label="Фамилия"
                error={errors.last_name?.message}
                icon={<User size={18} />}
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Input
                {...register('email')}
                type="email"
                label="Имейл адрес"
                error={errors.email?.message}
                icon={<Mail size={18} />}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Парола"
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

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="relative">
                <Input
                  {...register('confirm_password')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Потвърдете паролата"
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

            {/* Terms Checkbox */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.55 }}
            >
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  {...register('terms')}
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 sm:mt-1 text-[#00BFA6] bg-white border-2 border-[#E0E0E0] rounded cursor-pointer accent-[#00BFA6]"
                />
                <span className="text-xs sm:text-sm text-[#333333]">
                  Съгласен съм с{' '}
                  <Link
                    href="/terms"
                    className="text-[#00BFA6] hover:text-[#00a08c] font-medium"
                  >
                    Общи условия
                  </Link>{' '}
                  и{' '}
                  <Link
                    href="/privacy"
                    className="text-[#00BFA6] hover:text-[#00a08c] font-medium"
                  >
                    Политика за поверителност
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2">
                  {errors.terms.message}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                {!isLoading && <UserPlus size={18} className="sm:w-5 sm:h-5" />}
                Създайте акаунт
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="my-5 sm:my-6 flex items-center gap-3 sm:gap-4"
          >
            <div className="flex-1 h-px bg-[#E0E0E0]" />
            <span className="text-xs sm:text-sm text-[#777777]">или</span>
            <div className="flex-1 h-px bg-[#E0E0E0]" />
          </motion.div>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-center text-sm sm:text-base text-[#777777]"
          >
            Вече имате акаунт?{' '}
            <Link
              href={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
              className="text-[#00BFA6] hover:text-[#00a08c] font-semibold transition-colors"
            >
              Вход
            </Link>
          </motion.p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="text-center mt-4 sm:mt-6"
        >
          <Link
            href="/"
            className="text-[#777777] hover:text-[#00BFA6] transition-colors text-xs sm:text-sm"
          >
            ← Начало
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Зареждане на формата за регистрация..." />}>
      <RegisterPageContent />
    </Suspense>
  );
}