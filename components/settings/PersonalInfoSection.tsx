'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PersonalInfoSectionProps {
  initialData: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  onSave: (data: { first_name: string; last_name: string; phone: string }) => Promise<void>;
}

export default function PersonalInfoSection({ initialData, onSave }: PersonalInfoSectionProps) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.first_name?.trim()) {
      newErrors.first_name = 'Името е задължително';
    }
    if (!data.last_name?.trim()) {
      newErrors.last_name = 'Фамилията е задължителна';
    }
    if (!data.phone?.trim()) {
      newErrors.phone = 'Телефонният номер е задължителен';
    } else if (!/^[\d+\-\s()]+$/.test(data.phone)) {
      newErrors.phone = 'Невалиден телефонен номер';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      setErrors({});
      await onSave(data);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center">
            <User size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
            Лична информация
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              label="Име"
              value={data.first_name}
              onChange={(e) => setData({ ...data, first_name: e.target.value })}
              error={errors.first_name}
              required
            />

            <Input
              label="Фамилия"
              value={data.last_name}
              onChange={(e) => setData({ ...data, last_name: e.target.value })}
              error={errors.last_name}
              required
            />
          </div>

          <Input
            label="Телефонен номер"
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            error={errors.phone}
            icon={<Phone size={16} className="sm:w-[18px] sm:h-[18px]" />}
            required
          />

          <div className="flex justify-end pt-3 sm:pt-4">
            <Button
              onClick={handleSave}
              size="lg"
              disabled={saving}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <Save size={18} className="sm:w-5 sm:h-5" />
              {saving ? 'Запазване...' : 'Запази промените'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}