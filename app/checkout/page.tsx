'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CreditCard } from 'lucide-react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddressSelector } from '@/components/checkout/AddressSelector';
import { ShippingFormData, useCheckout } from '@/hooks/useCheckout';
import { formatPrice } from '@/lib/utils';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';

export default function CheckoutPage() {
  const {
    currentStep,
    shippingData,
    selectedShipping,
    shippingMethods,
    isSubmitting,
    savedAddresses,
    selectedAddressId,
    useNewAddress,
    items,
    total,
    user,
    form,
    setCurrentStep,
    setShippingData,
    setSelectedShipping,
    handleAddressSelect,
    handleUseNewAddress,
    handlePlaceOrder,
  } = useCheckout();

  const { register, handleSubmit, formState: { errors } } = form;

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(2);
  };


  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Breadcrumbs 
          items={[
            { label: 'Количка', href: '/cart' }, 
            { label: 'Плащане' }
          ]} 
        />

        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] mt-4 sm:mt-6 mb-6 sm:mb-8">
          Плащане
        </h1>

        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Side - Forms */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4">
                      {user && (
                        <AddressSelector
                          addresses={savedAddresses}
                          selectedAddressId={selectedAddressId}
                          useNewAddress={useNewAddress}
                          onSelectAddress={handleAddressSelect}
                          onUseNewAddress={handleUseNewAddress}
                        />
                      )}

                      <ShippingAddressForm
                        register={register}
                        errors={errors}
                        isGuest={!user}
                        hasAddresses={savedAddresses.length > 0}
                        useNewAddress={useNewAddress}
                      />

                      <Button type="submit" size="lg" className="w-full text-sm sm:text-base">
                        Продължи към доставка
                        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Shipping Method */}
              {currentStep === 2 && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
                      Начин на доставка
                    </h2>

                    <div className="space-y-3 mb-4 sm:mb-6">
                      {shippingMethods.map((method) => (
                        <motion.label
                          key={method.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`block p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedShipping?.id === method.id
                              ? 'border-[#00BFA6] bg-[#00BFA6]/5'
                              : 'border-[#E0E0E0] hover:border-[#00BFA6]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.id === method.id}
                            onChange={() => setSelectedShipping(method)}
                            className="sr-only"
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="text-sm sm:text-base font-semibold text-[#1F1F1F]">
                                {method.name}
                              </p>
                              <p className="text-xs sm:text-sm text-[#777777]">
                                {method.description}
                              </p>
                            </div>
                            <p className="text-sm sm:text-base font-bold text-[#00BFA6] whitespace-nowrap">
                              {parseFloat(method.price) === 0
                                ? 'БЕЗПЛАТНО'
                                : formatPrice(method.price)}
                            </p>
                          </div>
                        </motion.label>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 text-sm sm:text-base"
                      >
                        Назад
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 text-sm sm:text-base"
                        disabled={!selectedShipping}
                      >
                        Към плащане
                        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
                      Начин на плащане
                    </h2>

                    <div className="p-4 sm:p-6 border-2 border-[#00BFA6] rounded-lg bg-[#00BFA6]/5 mb-4 sm:mb-6">
                      <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <CreditCard size={20} className="text-[#00BFA6] flex-shrink-0 sm:w-6 sm:h-6" />
                        <h3 className="text-sm sm:text-base font-bold text-[#1F1F1F]">
                          Наложен платеж
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#777777]">
                        Плати при взимането на поръчката (наложен платеж).
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 text-sm sm:text-base"
                      >
                        Назад
                      </Button>
                      <Button
                        size="lg"
                        onClick={() => setCurrentStep(4)}
                        className="flex-1 text-sm sm:text-base"
                      >
                        Към преглед
                        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Review Order */}
              {currentStep === 4 && shippingData && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 sm:p-6 mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
                      Преглед на поръчката
                    </h2>

                    {/* Shipping Address */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-sm sm:text-base font-semibold text-[#1F1F1F]">
                          Адрес за доставка
                        </h3>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-[#00BFA6] text-xs sm:text-sm hover:text-[#00a08c]"
                        >
                          Редактирай
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-[#777777]">
                        {shippingData.first_name} {shippingData.last_name}<br />
                        {shippingData.address_line1}<br />
                        {shippingData.address_line2 && <>{shippingData.address_line2}<br /></>}
                        {shippingData.city}, {shippingData.state} {shippingData.postal_code}<br />
                        {shippingData.country}<br />
                        {shippingData.phone}
                      </p>
                    </div>

                    {/* Shipping Method */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h3 className="text-sm sm:text-base font-semibold text-[#1F1F1F]">
                          Начин на доставка
                        </h3>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-[#00BFA6] text-xs sm:text-sm hover:text-[#00a08c]"
                        >
                          Редактирай
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-[#777777]">
                        {selectedShipping?.name} - {selectedShipping?.description}
                      </p>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-[#1F1F1F] mb-2 sm:mb-3">
                        Начин на плащане
                      </h3>
                      <p className="text-xs sm:text-sm text-[#777777]">Наложен платеж</p>
                    </div>
                  </Card>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 text-sm sm:text-base"
                    >
                      Назад
                    </Button>
                    <Button
                      size="lg"
                      onClick={handlePlaceOrder}
                      isLoading={isSubmitting}
                      className="flex-1 text-sm sm:text-base"
                    >
                      Потвърди поръчката
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side - Order Summary - Sticky on desktop, normal flow on mobile */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              total={total}
              selectedShipping={selectedShipping}
            />
          </div>
        </div>
      </div>
    </div>
  );
}