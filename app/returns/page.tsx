'use client'

import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <Breadcrumbs items={[{ label: 'Връщане и замяна' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4 sm:mb-6 mt-4 sm:mt-6">
            Връщане и замяна на стоки
          </h1>

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333333]">
            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Право на отказ от договора</h2>
            <ul className="mb-3 sm:mb-4 list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Потребителят има право да се откаже от договора и да върне закупените стоки в срок от 14 дни от датата на получаването им, без да посочва причина, съгласно чл. 50 от Закона за защита на потребителите.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Условия за връщане на стоки</h2>
            <ul className="mb-3 sm:mb-4 list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Стоката трябва да бъде върната в оригиналната си опаковка и в търговски вид (без следи от употреба, надраскване, повреда или други видими дефекти).</li>
              <li>Всички придружаващи документи (гаранционна карта, касова бележка/фактура, инструкции за употреба и др.) трябва да бъдат върнати заедно със стоката.</li>
              <li>Стоката трябва да бъде изпратена на посочения от Доставчика адрес: гр. Хасково, пл. Свобода 1, ИКАР ЕООД, +359 888 202 487</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Разходи за връщане са за сметка на Потребителя, ако:</h2>
            <ul className="mb-3 sm:mb-4 list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base">  
              <li>Връщането е поради дефект на продукта или грешка при изпълнението на поръчката, извършена от страна на Доставчика.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Замяна на стока</h2>
            <ul className="mb-3 sm:mb-4 list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Ако Потребителят желае да замени продукт с друг (например друг размер или цвят), това може да бъде направено при следните условия:
                <ul className="list-disc list-inside ml-4 sm:ml-6 mt-1.5 sm:mt-2 space-y-1">
                 <li>Заявката за замяна трябва да бъде направена в срок от 14 дни от получаването на стоката.</li>
                  <li>Замяната е възможна само ако стоката, която Потребителят желае, е налична.</li>
                </ul>
              </li>
              <li>При замяна на стока разходите за транспорт в двете посоки са за сметка на Потребителя, освен ако замяната не е по вина на Доставчика.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Възстановяване на суми</h2>
            <ul className="mb-3 sm:mb-4 list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>В случай на отказ от договора и връщане на стоката, Доставчикът ще възстанови заплатената сума в срок до 14 дни от датата, на която стоката е върната и приета.</li>
              <li>Възстановяването ще бъде извършено по същия начин, по който е направено плащането, освен ако Потребителят изрично не е посочил друго.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Продукти, които не подлежат на връщане или замяна</h2>
            <ul className="mb-3 sm:mb-4 list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Запечатани продукти, които са разпечатани след доставката и не могат да бъдат върнати по хигиенни или здравословни причини</li>
              <li>Стоки, изработени или модифицирани по индивидуална поръчка на Потребителя, освен при установен дефект.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}