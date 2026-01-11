'use client'

import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <Breadcrumbs items={[{ label: 'Поверителност и сигурност' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4 sm:mb-6 mt-4 sm:mt-6">
            Поверителност и сигурност
          </h1>

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333333]">
            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Обща информация</h2>
            <div className="mb-3 sm:mb-4">
              <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
                <li>
                   <b>ИКАР ЕООД</b> (наричан по-долу &quot;Доставчик&quot;) обработва личните данни на Потребителите на онлайн магазина <b>Zekto</b> в съответствие с изискванията на <b>Регламент (ЕС) 2016/679</b> (Общ регламент за защита на данните – GDPR) и българското законодателство, свързано със защита на личните данни.
                </li>
                <li>
                 С приемането на настоящите Общи условия, Потребителят дава съгласието си за обработка на предоставените лични данни за целите, посочени по-долу.
                </li>
              </ul>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Събирани лични данни</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li><b>Идентификационни данни:</b> име, фамилия</li>
              <li><b>Контактна информация:</b> телефонен номер, имейл адрес, адрес за доставка</li>
              <li><b>Данни за поръчките:</b> история на покупките, избрани продукти и услуги</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Цели на обработката на лични данни</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Обработване и изпълнение на поръчки, направени чрез онлайн магазина</li>
              <li>Доставка на закупените продукти до посочения от Потребителя адрес</li>
              <li>Издаване на данъчни фактури, когато е необходимо</li>
              <li>Информация за актуализации, промоции и новини (само при изрично съгласие на Потребителя)</li>
              <li>Установяване на контакт с Потребителя във връзка с негови запитвания или рекламации</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Правно основание за обработка</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li><b>Съгласие на Потребителя</b> – за маркетингови цели и абонаменти за бюлетини</li>
              <li><b>Договорни задължения</b> – за обработване на поръчки и доставка на стоки</li>
              <li><b>Законодателни изисквания</b> – за счетоводни и данъчни цели</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Срок за съхранение на данните</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Личните данни се съхраняват за период, необходим за изпълнение на целите, за които са събрани</li>
              <li>Маркетингови данни – до оттегляне на съгласието от страна на Потребителя</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Предоставяне на лични данни на трети лица</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Куриерски фирми – за извършване на доставките</li>
              <li>Счетоводни фирми – за обработка на счетоводни документи</li>
              <li>Държавни органи – при спазване на законовите изисквания</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Права на Потребителите</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li><b>Право на достъп</b> – право да получи информация за събраните данни и начина на тяхната обработка</li>
              <li><b>Право на коригиране</b> – право да поиска корекция на неточни или непълни данни</li>
              <li><b>Право на изтриване (&quot;право да бъдеш забравен&quot;)</b> – право да поиска изтриване на данните, освен ако законът не изисква тяхното съхранение</li>
              <li><b>Право на ограничаване на обработката</b> – право да ограничи обработката на данни при определени обстоятелства</li>
              <li><b>Право на преносимост</b> – право да получи личните си данни в структуриран, машинно четим формат</li>
              <li><b>Право на възражение</b> – право да възрази срещу обработването на данни за определени цели</li>
            </ul>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              За да упражни тези права, Потребителят може да се свърже с Доставчика чрез:
              <br />Имейл: <b>support@zekto.com</b>
              <br />Телефон: <b>+359 888 202 487</b>
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Сигурност на личните данни</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Доставчикът прилага подходящи технически и организационни мерки за защита на личните данни от загуба, неоторизиран достъп, промяна или разпространение.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Контакти с надзорен орган</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Ако Потребителят смята, че неговите права са нарушени, може да подаде жалба до:
              <br /><b>Комисия за защита на личните данни:</b>
              <br />Адрес: гр. София 1592, бул. &quot;Проф. Цветан Лазаров&quot; № 2
              <br />Телефон: 02/91-53-518
              <br />Уебсайт: www.cpdp.bg
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}