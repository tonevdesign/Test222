'use client'

import { motion } from 'framer-motion';
import { MapPin, Truck, CreditCard, CheckCircle } from 'lucide-react';

const steps = [
  { id: 1, name: 'Адрес', icon: MapPin },
  { id: 2, name: 'Доставка', icon: Truck },
  { id: 3, name: 'Плащане', icon: CreditCard },
  { id: 4, name: 'Преглед', icon: CheckCircle },
];

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                animate={{
                  scale: currentStep === step.id ? 1.1 : 1,
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step.id
                    ? 'bg-[#00BFA6] text-white'
                    : 'bg-white text-[#777777] border-2 border-[#E0E0E0]'
                }`}
              >
                <step.icon size={20} />
              </motion.div>
              <span
                className={`text-xs mt-2 font-medium ${
                  currentStep >= step.id ? 'text-[#00BFA6]' : 'text-[#777777]'
                }`}
              >
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-[#E0E0E0] relative">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: currentStep > step.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-[#00BFA6] origin-left"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}