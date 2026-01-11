'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api';
import { Address } from '@/types/user';
import { ProtectedPage } from '@/components/auth/ProtectedPage';

interface AddressFormData {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

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

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<AddressFormData>({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'България',
    is_default: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses when authenticated
  useEffect(() => {
    fetchAddresses();
  }, []);

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

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Address[]>('/users/addresses');
      if (response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      showError('Неуспешно зареждане на адресите');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'България',
      is_default: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      address_line1: address.address_line1 || '',
      address_line2: address.address_line2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || 'България',
      is_default: address.is_default || false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.address_line1?.trim()) {
      errors.address_line1 = 'Адресът е задължителен';
    }
    if (!formData.city?.trim()) {
      errors.city = 'Градът е задължителен';
    }
    if (!formData.state?.trim()) {
      errors.state = 'Областта е задължителна';
    }
    if (!formData.postal_code?.trim()) {
      errors.postal_code = 'Пощенският код е задължителен';
    }
    if (!formData.country?.trim()) {
      errors.country = 'Държавата е задължителна';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showError('Моля, попълнете всички задължителни полета');
      return;
    }

    try {
      setSubmitting(true);
      setFormErrors({});

      if (editingAddress) {
        await apiClient.put(`/users/addresses/${editingAddress.id}`, formData);
        showSuccess('Адресът е актуализиран успешно!');
      } else {
        await apiClient.post('/users/addresses', formData);
        showSuccess('Адресът е добавен успешно!');
      }

      await fetchAddresses();
      setIsModalOpen(false);
    } catch (error: unknown) {
      if (isApiError(error) && error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
        showError('Моля, коригирайте грешките във формата');
      } else if (isApiError(error) && error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Неуспешно запазване на адреса. Моля, опитайте отново.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await apiClient.post(`/users/addresses/${id}/set-default`);
      await fetchAddresses();
      showSuccess('Основният адрес е променен успешно!');
    } catch (error) {
      console.error('Failed to set default address:', error);
      showError('Неуспешна промяна на основния адрес');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/users/addresses/${id}`);
      await fetchAddresses();
      setDeleteConfirmId(null);
      showSuccess('Адресът е изтрит успешно!');
    } catch (error) {
      console.error('Failed to delete address:', error);
      showError('Неуспешно изтриване на адреса');
    }
  };

  return (
    <ProtectedPage loadingText="Зареждане на адресите...">
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-[#777777] mb-4">
              <Link href="/account" className="hover:text-[#00BFA6]">
                Акаунт
              </Link>
              <ChevronRight size={16} />
              <span className="text-[#1F1F1F] font-medium">Адреси</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] mb-2">
                  Моите адреси
                </h1>
                <p className="text-sm sm:text-base text-[#777777]">
                  Управлявайте вашите адреси за по-бързо плащане
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="bg-[#00BFA6] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#00a08c] transition-colors self-start sm:self-auto text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                Добави адрес
              </button>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 sm:mb-6"
            >
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-3">
                <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5 sm:mt-0 sm:w-5 sm:h-5" />
                <p className="text-sm sm:text-base text-green-800 font-medium">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 sm:mb-6"
            >
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-3">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5 sm:mt-0 sm:w-5 sm:h-5" />
                <p className="text-sm sm:text-base text-red-800 font-medium">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          {/* Addresses Grid */}
          {addresses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 sm:p-12 text-center">
                <MapPin size={40} className="sm:w-12 sm:h-12 mx-auto text-[#777777] mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-2">
                  Няма добавени адреси
                </h3>
                <p className="text-sm sm:text-base text-[#777777] mb-4 sm:mb-6">
                  Добавете първия си адрес, за да направите плащането по-бързо
                </p>
                <button
                  onClick={openAddModal}
                  className="bg-[#00BFA6] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-[#00a08c] transition-colors text-sm sm:text-base"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  Добави адрес
                </button>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-4 sm:p-6 relative hover:shadow-lg transition-shadow">
                    {address.is_default && (
                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                        <span className="bg-[#00BFA6] text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                          По подразбиране
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className='mb-2'>
                        <MapPin size={18} className="text-[#00BFA6] sm:w-5 sm:h-5"/>
                      </div>
                      
                      <div className="text-sm sm:text-base text-[#777777] space-y-1 min-h-[100px] sm:min-h-[110px]">
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>
                          {address.city}, {address.state} {address.postal_code}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#F5F5F5]">
                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#00BFA6] border border-[#00BFA6] rounded-lg hover:bg-[#00BFA6]/5 transition-colors"
                        >
                          <Check size={14} className="sm:w-4 sm:h-4" />
                          Задай основен
                        </button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(address)}
                        className={`text-xs sm:text-sm ${!address.is_default ? '' : 'flex-1'}`}
                      >
                        <Edit2 size={14} className="sm:w-4 sm:h-4" />
                        Редактирай
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirmId(address.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                      >
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </Button>
                    </div>

                    {/* Delete Confirmation */}
                    <AnimatePresence>
                      {deleteConfirmId === address.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg border-2 border-red-200"
                        >
                          <p className="text-xs sm:text-sm text-red-800 mb-3">
                            Сигурни ли сте, че искате да изтриете този адрес?
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleDelete(address.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                            >
                              Изтрий
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-xs sm:text-sm"
                            >
                              Отказ
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add/Edit Address Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="sticky top-0 bg-white border-b border-[#F5F5F5] p-4 sm:p-6 flex items-center justify-between rounded-t-xl">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
                    {editingAddress ? 'Редактирай адрес' : 'Добави нов адрес'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-[#777777] hover:text-[#1F1F1F] transition-colors"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Address Fields */}
                  <Input
                    label="Адрес 1"
                    value={formData.address_line1}
                    onChange={(e) =>
                      setFormData({ ...formData, address_line1: e.target.value })
                    }
                    error={formErrors.address_line1}
                    required
                  />

                  <Input
                    label="Адрес 2 (по избор)"
                    value={formData.address_line2}
                    onChange={(e) =>
                      setFormData({ ...formData, address_line2: e.target.value })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <Input
                      label="Град"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      error={formErrors.city}
                      required
                    />
                    <Input
                      label="Област"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      error={formErrors.state}
                      required
                    />
                    <Input
                      label="Пощ. код"
                      value={formData.postal_code}
                      onChange={(e) =>
                        setFormData({ ...formData, postal_code: e.target.value })
                      }
                      error={formErrors.postal_code}
                      required
                    />
                  </div>

                  <Input
                    label="Държава"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    error={formErrors.country}
                    required
                  />

                  {/* Default Checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) =>
                        setFormData({ ...formData, is_default: e.target.checked })
                      }
                      className="w-4 h-4 text-[#00BFA6] focus:ring-[#00BFA6] rounded"
                    />
                    <span className="text-sm sm:text-base text-[#1F1F1F]">Задай като основен адрес</span>
                  </label>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#F5F5F5]">
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      className="flex-1 text-sm sm:text-base"
                      disabled={submitting}
                    >
                      {submitting
                        ? 'Запазване...'
                        : editingAddress
                        ? 'Актуализирай адрес'
                        : 'Добави адрес'}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsModalOpen(false)}
                      disabled={submitting}
                      className="text-sm sm:text-base"
                    >
                      Отказ
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}