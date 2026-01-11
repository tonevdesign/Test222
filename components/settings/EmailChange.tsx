'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Eye, EyeOff, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailChangeSectionProps {
  currentEmail: string;
  pendingEmail?: string | null;
  onChangeEmail: (data: { new_email: string; password: string }) => Promise<void>;
}

export default function EmailChangeSection({ 
  currentEmail, 
  pendingEmail, 
  onChangeEmail 
}: EmailChangeSectionProps) {
  const [data, setData] = useState({ new_email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [changing, setChanging] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.new_email?.trim()) {
      newErrors.new_email = 'Новият имейл е задължителен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.new_email)) {
      newErrors.new_email = 'Невалиден имейл адрес';
    } else if (data.new_email.toLowerCase() === currentEmail.toLowerCase()) {
      newErrors.new_email = 'Новият имейл е същият като текущия';
    }

    if (!data.password?.trim()) {
      newErrors.password = 'Паролата е задължителна за потвърждение';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;

    try {
      setChanging(true);
      setErrors({});
      await onChangeEmail(data);
      setData({ new_email: '', password: '' });
    } catch (error: any) {
      console.error('Email change error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setChanging(false);
    }
  };

  const isPending = !!pendingEmail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center">
            <Mail size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
            Смяна на имейл адрес
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="bg-[#F5F5F5] p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-[#777777]">
              <strong className="text-[#1F1F1F]">Текущ имейл:</strong> {currentEmail}
            </p>
          </div>

          <Input
            label="Нов имейл адрес"
            type="email"
            value={data.new_email}
            onChange={(e) => setData({ ...data, new_email: e.target.value })}
            error={errors.new_email}
            icon={<Mail size={16} className="sm:w-[18px] sm:h-[18px]" />}
            required
            disabled={isPending}
          />

          <div className="relative">
            <Input
              label="Потвърдете с парола"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              error={errors.password}
              required
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] sm:top-[42px] text-[#777777] hover:text-[#1F1F1F] transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-blue-800 flex items-start gap-2">
              <Info size={14} className="flex-shrink-0 mt-0.5 sm:w-4 sm:h-4" />
              <span>
                След промяната ще получите имейл за потвърждение на новия адрес. Имейлът ви няма да бъде променен, докато не потвърдите.
              </span>
            </p>
          </div>

          <div className="flex justify-end pt-3 sm:pt-4">
            <Button
              onClick={handleChange}
              size="lg"
              disabled={changing || isPending}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <Mail size={18} className="sm:w-5 sm:h-5" />
              {changing ? 'Изпращане...' : 'Промени имейла'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}