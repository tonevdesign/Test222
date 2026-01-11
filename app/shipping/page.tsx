'use client'

import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <Breadcrumbs items={[{ label: 'Доставка и плащане' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4 sm:mb-6 mt-4 sm:mt-6">
            Доставка и плащане
          </h1>

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333333]">
            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Потребителска кошница за нерегистрирани посетители</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Всеки наш посетител може да пазарува от онлайн магазина без да е регистриран. Всеки наш посетител получава Потребителска кошница. Това позволява на посетителя временно да съхранява желаните продукти. При изход от магазина, съдържанието в кошницата се губи.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Потребителска кошница за регистрирани посетители</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Всеки наш регистриран посетител получава Потребителска кошница. Това позволява на регистрираният потребител постоянно да съхранява желаните продукти. При изход от магазина, съдържанието ѝ не се губи.
            </p>

            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Ако нерегистриран потребител е избрал продукти и ги е поставил в Потребителска кошница до процедурата по регистрация, а после е изпълнил регистрация, то продуктите автоматично се запазват в новата Потребителска кошница.
            </p>

            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              За всички градове в които има офис на Speedy поръчките се доставят обикновено на следващия работен ден, освен ако не възникнат обстоятелства, независещи от нас. За останалите дестинации доставката е в срок до 3 работни дни, в зависимост от графика за посещения на куриерската фирма. Доставки се извършват в работни дни, между 9:00 и 18:00 часа и в събота от 9:00 до 13:00 часа.
            </p>

            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Поръчки направени до 16:00 часа в работен ден и до 11:00 часа в събота, се обработват същия ден.
            </p>

            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Поръчки направени след 16:00 часа в работен ден, след 11:00 часа в събота и през празнични и почивни дни се обработват на следващия работен ден.
            </p>

            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              За поръчки направени до офис на Еконт или Спийди се заплаща куриерска услуга в размер на около 4 € в зависимост от стойността на наложеният платеж и теглото, и около 5 € в зависимост от наложеният платеж и теглото ако е до адрес.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Поръчка</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Въведете Вашите персонални данни, име, адрес и мобилен телефон, за да можем да се свържем с Вас. Данните, които предоставяте са само и единствено, за да можем да обработим поръчката Ви.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Потвърждаване</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              След като получим Вашата заявка, ще се свържем с Вас по телефона, който сте оставили за обратна връзка. Ще уточним деня за доставка на поръчката Ви.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Доставка</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Вашата поръчка ще Ви бъде доставена с куриерска фирма Еконт или Спийди. Срокът за доставка е от 1 до 3 работни дни, в зависимост от населеното място.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Плащане</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Плащането се извършва в момента на доставката. Всяка пратка е винаги с опция за преглед и тест преди да бъде извършено плащането.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}