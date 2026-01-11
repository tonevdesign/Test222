import { Input } from '@/components/ui/input';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { ShippingFormData } from '@/hooks/useCheckout';

interface ShippingAddressFormProps {
  register: UseFormRegister<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
  isGuest: boolean;
  hasAddresses: boolean;
  useNewAddress: boolean;
}

export function ShippingAddressForm({
  register,
  errors,
  isGuest,
  hasAddresses,
  useNewAddress,
}: ShippingAddressFormProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-[#1F1F1F] mb-3 sm:mb-4">
        {hasAddresses && !useNewAddress ? 'Детайли на адреса' : 'Адрес за доставка'}
      </h3>

      {/* Hidden country field - always set to България */}
      <input
        {...register('country')}
        type="hidden"
        value="България"
      />

      {/* Email - Show for guests or at top for logged-in users */}
      {isGuest && (
        <Input
          {...register('guest_email')}
          type="email"
          label="Имейл адрес"
          error={errors.guest_email?.message}
        />
      )}

      {!isGuest && (
        <Input
          {...register('guest_email')}
          type="email"
          label="Имейл адрес"
          error={errors.guest_email?.message}
        />
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Input
          {...register('first_name')}
          label="Име"
          error={errors.first_name?.message}
        />
        <Input
          {...register('last_name')}
          label="Фамилия"
          error={errors.last_name?.message}
        />
      </div>

      {/* Address Line 1 */}
      <Input
        {...register('address_line1')}
        label="Адрес 1"
        error={errors.address_line1?.message}
      />

      {/* Address Line 2 */}
      <Input
        {...register('address_line2')}
        label="Адрес 2 (по избор)"
      />

      {/* City and State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Input
          {...register('city')}
          label="Град"
          error={errors.city?.message}
        />
        <Input
          {...register('state')}
          label="Област"
          error={errors.state?.message}
        />
      </div>

      {/* Postal Code and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Input
          {...register('postal_code')}
          label="Пощенски код"
          error={errors.postal_code?.message}
        />
        <Input
          {...register('phone')}
          label="Телефонен номер"
          error={errors.phone?.message}
        />
      </div>
    </div>
  );
}