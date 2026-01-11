import { motion } from "framer-motion";
import { EyeOff, Eye, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

interface PasswordChangeSectionProps {
  onChangePassword: (data: { current_password: string; new_password: string }) => Promise<void>;
}

export default function PasswordChangeSection({ onChangePassword }: PasswordChangeSectionProps) {
  const [data, setData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.current_password?.trim()) {
      newErrors.current_password = 'Текущата парола е задължителна';
    }
    if (!data.new_password?.trim()) {
      newErrors.new_password = 'Новата парола е задължителна';
    } else if (data.new_password.length < 6) {
      newErrors.new_password = 'Паролата трябва да е поне 6 символа';
    }
    if (!data.confirm_password?.trim()) {
      newErrors.confirm_password = 'Моля, потвърдете новата парола';
    } else if (data.new_password !== data.confirm_password) {
      newErrors.confirm_password = 'Паролите не съвпадат';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      setErrors({});
      await onChangePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      });
      setData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        const errorMsg = error.response.data.message;
        if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('парола')) {
          setErrors({ current_password: errorMsg });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00BFA6]/10 rounded-lg flex items-center justify-center">
            <Lock size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
            Смяна на парола
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <Input
              label="Текуща парола"
              type={showCurrentPassword ? 'text' : 'password'}
              value={data.current_password}
              onChange={(e) => setData({ ...data, current_password: e.target.value })}
              error={errors.current_password}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-[38px] sm:top-[42px] text-[#777777] hover:text-[#1F1F1F] transition-colors"
            >
              {showCurrentPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Нова парола"
              type={showNewPassword ? 'text' : 'password'}
              value={data.new_password}
              onChange={(e) => setData({ ...data, new_password: e.target.value })}
              error={errors.new_password}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[38px] sm:top-[42px] text-[#777777] hover:text-[#1F1F1F] transition-colors"
            >
              {showNewPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Потвърдете новата парола"
              type={showConfirmPassword ? 'text' : 'password'}
              value={data.confirm_password}
              onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
              error={errors.confirm_password}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] sm:top-[42px] text-[#777777] hover:text-[#1F1F1F] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </button>
          </div>

          <div className="bg-[#F5F5F5] p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm font-medium text-[#1F1F1F] mb-2">
              Изисквания за парола:
            </p>
            <ul className="text-xs sm:text-sm text-[#777777] space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] flex-shrink-0"></div>
                Поне 6 символа дълга
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] flex-shrink-0"></div>
                Препоръчва се комбинация от букви и цифри
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00BFA6] flex-shrink-0"></div>
                Избягвайте често използвани думи или модели
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-3 sm:pt-4">
            <Button
              onClick={handleChange}
              size="lg"
              disabled={saving}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <Lock size={18} className="sm:w-5 sm:h-5" />
              {saving ? 'Актуализиране...' : 'Смяна на паролата'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}