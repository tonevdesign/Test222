'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { useAuth } from '@/hooks/useAuth';
import PersonalInfoSection from '@/components/settings/PersonalInfoSection';
import EmailChangeSection from '@/components/settings/EmailChange';
import PasswordChangeSection from '@/components/settings/PasswordChangeSection';
import AccountInfoSection from '@/components/settings/AccountInfoSection';
import EmailVerificationModal from '@/components/settings/EmailVerificationModal';
import NotificationPreferences from '@/components/notifications/NotificationPreferences';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, string>;
      message?: string;
    };
  };
  message?: string;
}

function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('response' in error || 'message' in error)
  );
}

function ProfileSettingsPageContent() {
  const { user, updateProfile } = useAuth();
  const searchParams = useSearchParams();

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sendingVerification, setSendingVerification] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState(false);

  useEffect(() => {
    if (user) {
      setPendingEmailChange(!!(user as any).pending_email);
    }
  }, [user]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setShowVerificationModal(true);
    }
  }, [searchParams]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const handleSaveProfile = async (data: {
    first_name: string;
    last_name: string;
    phone: string;
  }) => {
    try {
      const updatedUser = await updateProfile(data);
      if (updatedUser) {
        showSuccess('Профилът е обновен успешно!');
      }
    } catch (error) {
      if (isApiError(error) && error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Неуспешно обновяване на профила.');
      }
      throw error;
    }
  };

  const handleChangeEmail = async (data: {
    new_email: string;
    password: string;
  }) => {
    try {
      await apiClient.post('/auth/request-email-change', {
        new_email: data.new_email.toLowerCase().trim(),
        password: data.password,
      });

      setPendingEmailChange(true);
      showSuccess(
        'Имейл за потвърждение е изпратен на новия адрес. Проверете пощата си.'
      );
    } catch (error) {
      if (isApiError(error) && error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Неуспешна промяна на имейла.');
      }
      throw error;
    }
  };

  const handleChangePassword = async (data: {
    current_password: string;
    new_password: string;
  }) => {
    try {
      await apiClient.post('/auth/change-password', data);
      showSuccess(
        'Паролата е променена успешно! Всички други сесии са прекратени.'
      );
    } catch (error) {
      if (isApiError(error) && error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Неуспешна смяна на паролата.');
      }
      throw error;
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) {
      showError('Имейл адресът не е наличен');
      return;
    }

    try {
      setSendingVerification(true);
      await apiClient.post('/auth/resend-verification', {
        email: user.email,
      });
      showSuccess(
        'Имейл за потвърждение е изпратен успешно! Проверете пощата си.'
      );
    } catch (error) {
      if (isApiError(error) && error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Неуспешно изпращане на имейл.');
      }
    } finally {
      setSendingVerification(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedPage loadingText="Зареждане на настройките...">
      {showVerificationModal && (
        <EmailVerificationModal
          onClose={() => setShowVerificationModal(false)}
        />
      )}

      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="container mx-auto px-4 py-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#777]">
            <Link href="/account" className="hover:text-[#00BFA6]">
              Акаунт
            </Link>
            <ChevronRight size={14} />
            <span className="font-medium text-[#1F1F1F]">Профил</span>
          </div>

          <h1 className="text-3xl font-bold">Настройки на профила</h1>

          {/* Alerts */}
          {successMessage && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex gap-3">
              <CheckCircle className="text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-red-600" />
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
          )}

          {pendingEmailChange && (user as any).pending_email && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="text-amber-600" />
              <p className="text-amber-800">
                Очаква се потвърждение за имейл:{' '}
                <strong>{(user as any).pending_email}</strong>
              </p>
            </div>
          )}

          {/* Sections */}
          <PersonalInfoSection
            initialData={{
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              phone: user.phone || '',
            }}
            onSave={handleSaveProfile}
          />

          <EmailChangeSection
            currentEmail={user.email}
            pendingEmail={(user as any).pending_email}
            onChangeEmail={handleChangeEmail}
          />

          <PasswordChangeSection
            onChangePassword={handleChangePassword}
          />

          <AccountInfoSection
            user={user}
            onResendVerification={handleResendVerification}
            sendingVerification={sendingVerification}
          />

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-[#00BFA6]" />
              <h2 className="text-xl font-bold">
                Предпочитания за известия
              </h2>
            </div>
            <NotificationPreferences />
          </Card>
        </div>
      </div>
    </ProtectedPage>
  );
}

export default function ProfileSettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileSettingsPageContent />
    </Suspense>
  );
}
