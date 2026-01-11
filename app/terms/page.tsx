'use client'

import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <Breadcrumbs items={[{ label: 'Общи условия' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4 sm:mb-6 mt-4 sm:mt-6">
            Общи условия
          </h1>

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333333]">
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Настоящите Общи условия уреждат отношенията между <b>ИКАР ЕООД</b>, ЕИК BG126618492, със седалище и адрес на управление: пл. Свобода 1, наричано по-долу &quot;Доставчик&quot;, и лицата, ползващи електронния магазин <b>Zekto</b>, достъпен на адрес https://zekto.bg (наричани по-долу &quot;Потребител/и&quot;).
            </p>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Чрез достъпа и използването на онлайн магазина, Потребителят потвърждава, че е прочел, разбрал и приел настоящите Общи условия.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Дефиниции</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li><b>Доставчик</b> – Фирма ИКАР ЕООД, която предоставя услуги чрез електронния магазин Zekto.bg.</li>
              <li><b>Потребител</b> – Всяко физическо или юридическо лице, което посещава, разглежда или използва услугите на онлайн магазина.</li>
              <li><b>Електронен магазин</b> – Уебсайтът Zekto.bg, чрез който Доставчикът предлага стоки или услуги за покупка.</li>
              <li><b>Стоки и услуги</b> – Всички продукти и услуги, предлагани за продажба чрез Zekto.bg.</li>
              <li><b>Поръчка</b> – Изявление на воля от страна на Потребителя за закупуване на конкретни стоки или услуги, направено чрез електронния магазин.</li>
              <li><b>Договор за покупко-продажба</b> – Договор между Доставчика и Потребителя, сключен въз основа на направена и потвърдена Поръчка.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Общи положения</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Настоящите Общи условия са задължителни за всички Потребители на онлайн магазина Zekto.bg.</li>
              <li>Доставчикът си запазва правото да променя настоящите Общи условия по всяко време, като измененията влизат в сила от момента на публикуването им на сайта.</li>
              <li>При използване на онлайн магазина, Потребителят се задължава да спазва настоящите Общи условия, както и приложимото законодателство на Република България.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Регистрация и поръчка</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Потребителят може да пазарува чрез създаване на потребителски профил или като гост (без регистрация).</li>
              <li>При регистрация Потребителят е длъжен да предостави коректна, точна и актуална информация.</li>
              <li>Поръчките се правят чрез добавяне на избрани продукти в количката и попълване на необходимите данни за доставка и плащане.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Цени и плащания</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Всички цени на продуктите са в евро (EUR) и включват ДДС.</li>
              <li>Доставчикът си запазва правото да променя цените на продуктите по всяко време.</li>
              <li>Потребителят заплаща стойността на поръчката чрез следните методи на плащане: Наложен платеж (при доставка).</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Доставка</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Доставката се извършва до посочен от Потребителя адрес или до офис на куриерска фирма, избрана от Доставчика.</li>
              <li>Срокът за доставка е между 1 и 3 работни дни, освен ако в описанието на конкретния продукт не е посочено друго.</li>
              <li>Цената на доставката се посочва по време на оформяне на поръчката.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Отказ от поръчка и връщане на стоки</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Потребителят има право да се откаже от поръчката в срок от 14 дни от датата на получаване на стоката, без да посочва причина, съгласно Закона за защита на потребителите.</li>
              <li>За да упражни правото си на отказ, Потребителят трябва да попълни формуляр за отказ, който може да бъде изтеглен от сайта.</li>
              <li>Върнатите стоки трябва да бъдат в същото състояние, в което са получени – без увреждания, с оригиналната опаковка и придружаващите документи.</li>
              <li>Разходите за връщане на стоката са за сметка на Потребителя, освен ако връщането не е поради грешка на Доставчика.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Гаранции и рекламации</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Всички продукти, предлагани на сайта, са с гаранция съгласно приложимото законодателство и/или условията на производителя.</li>
              <li>При възникване на проблем с продукта, Потребителят има право да подаде рекламация чрез контакт с Доставчика.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Защита на личните данни</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Доставчикът обработва личните данни на Потребителите в съответствие с Общия регламент за защита на данните (GDPR) и българското законодателство.</li>
              <li>Повече информация за обработването на лични данни можете да намерите в нашата <a href="/privacy" className="text-[#00BFA6] hover:text-[#00a08c] underline">Политика за поверителност</a>.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Ограничение на отговорността</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Доставчикът не носи отговорност за:
                <ul className="list-disc pl-5 sm:pl-6 mt-1.5 sm:mt-2 space-y-1">
                  <li>Невъзможност за достъп до уебсайта поради технически причини извън неговия контрол.</li>
                  <li>Загуби, причинени от неправилно използване на продуктите от страна на Потребителя.</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Приложимо право</h2>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Настоящите Общи условия се уреждат от законодателството на Република България.</li>
              <li>В случай на спор, страните се стремят да го разрешат чрез преговори, а при невъзможност – спорът се отнася за разрешаване към компетентния български съд.</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Контакти</h2>
            <p className="mb-3 sm:mb-4 font-bold text-sm sm:text-base">
              ИКАР ЕООД
              <br />Адрес: пл. Свобода 1
              <br />Телефон: +359 888 202 487
              <br />Имейл: support@zekto.bg
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}