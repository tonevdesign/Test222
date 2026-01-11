'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const loginSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push(redirect);
    } catch {
      
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-3 sm:p-4 md:p-6">
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
            Добре дошли обратно
          </h1>
          <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
            Влезте в профила си, за да продължите
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
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

            {/* Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex items-center justify-end"
            >
              <Link
                href="/forgot-password"
                className="text-xs sm:text-sm text-[#00BFA6] hover:text-[#00a08c] font-medium transition-colors"
              >
                Забравена парола?
              </Link>
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
                {!isLoading && <LogIn size={18} className="sm:w-5 sm:h-5" />}
                Вход
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="my-6 sm:my-8 flex items-center gap-3 sm:gap-4"
          >
            <div className="flex-1 h-px bg-[#E0E0E0]" />
            <span className="text-xs sm:text-sm text-[#777777]">или</span>
            <div className="flex-1 h-px bg-[#E0E0E0]" />
          </motion.div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-center text-[#777777] text-sm sm:text-base"
          >
            Нямате профил?{' '}
            <Link
              href="/register"
              className="text-[#00BFA6] hover:text-[#00a08c] font-semibold transition-colors"
            >
              Регистрирай се
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

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Зареждане на формата за вход..." />}>
      <LoginPageContent />
    </Suspense>
  );
}