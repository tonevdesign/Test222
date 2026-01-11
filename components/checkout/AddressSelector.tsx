'use client';

import { motion } from 'framer-motion';
import { MapPin, Plus, CheckCircle } from 'lucide-react';
import { Address } from '@/types/user';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: number | null;
  useNewAddress: boolean;
  onSelectAddress: (addressId: number) => void;
  onUseNewAddress: () => void;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  useNewAddress,
  onSelectAddress,
  onUseNewAddress,
}: AddressSelectorProps) {
  if (addresses.length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-xs sm:text-sm font-medium text-[#1F1F1F] mb-2 sm:mb-3">
        Изберете запазен адрес
      </label>
      
      <div className="space-y-2 sm:space-y-3">
        {addresses.map((address) => (
          <motion.button
            key={address.id}
            type="button"
            onClick={() => onSelectAddress(address.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left p-3 sm:p-4 border-2 rounded-lg transition-all ${
              selectedAddressId === address.id && !useNewAddress
                ? 'border-[#00BFA6] bg-[#00BFA6]/5'
                : 'border-[#E0E0E0] hover:border-[#00BFA6]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <MapPin 
                  size={18} 
                  className={`mt-0.5 flex-shrink-0 sm:w-5 sm:h-5 ${
                    selectedAddressId === address.id && !useNewAddress
                      ? 'text-[#00BFA6]'
                      : 'text-[#777777]'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <p className="text-sm sm:text-base font-semibold text-[#1F1F1F] truncate">
                      {address.address_line1}
                    </p>
                    {address.is_default && (
                      <span className="text-xs px-2 py-0.5 bg-[#00BFA6]/10 text-[#00BFA6] rounded-full self-start">
                        По подразбиране
                      </span>
                    )}
                  </div>
                  {address.address_line2 && (
                    <p className="text-xs sm:text-sm text-[#777777] truncate">{address.address_line2}</p>
                  )}
                  <p className="text-xs sm:text-sm text-[#777777]">
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p className="text-xs sm:text-sm text-[#777777]">{address.country}</p>
                </div>
              </div>
              {selectedAddressId === address.id && !useNewAddress && (
                <CheckCircle size={20} className="text-[#00BFA6] flex-shrink-0 sm:w-6 sm:h-6" />
              )}
            </div>
          </motion.button>
        ))}

        {/* Add New Address Button */}
        <motion.button
          type="button"
          onClick={onUseNewAddress}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full p-3 sm:p-4 border-2 rounded-lg transition-all ${
            useNewAddress
              ? 'border-[#00BFA6] bg-[#00BFA6]/5'
              : 'border-[#E0E0E0] hover:border-[#00BFA6]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Plus 
                size={18} 
                className={`flex-shrink-0 sm:w-5 sm:h-5 ${useNewAddress ? 'text-[#00BFA6]' : 'text-[#777777]'}`}
              />
              <span className={`text-sm sm:text-base font-semibold ${
                useNewAddress ? 'text-[#00BFA6]' : 'text-[#1F1F1F]'
              }`}>
                Използвай нов адрес
              </span>
            </div>
            {useNewAddress && (
              <CheckCircle size={20} className="text-[#00BFA6] flex-shrink-0 sm:w-6 sm:h-6" />
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}