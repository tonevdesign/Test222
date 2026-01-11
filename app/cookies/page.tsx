'use client'

import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <Breadcrumbs items={[{ label: 'Бисквитки' }]} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-4 sm:mb-6 mt-4 sm:mt-6">
            Бисквитки
          </h1>

          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333333]">
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              За да работи този сайт както трябва, понякога запазваме на вашето устройство малки файлове с данни, наричани бисквитки. Повечето големи уебсайтове също използват този метод.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Какво представляват бисквитките?</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Бисквитките са малки текстови файлове, които се запазват на вашия компютър или мобилно устройство, когато посещавате даден уебсайт. Те позволяват на уебсайта да запаметява вашите действия и предпочитания (като например потребителско име, език, размер на шрифта и други настройки за показване) за определен период от време, за да не се налага да ги въвеждате всеки път, когато посещавате сайта или преминавате от една страница към друга.
            </p>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">По какъв начин използваме бисквитките?</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Посещаването на този сайт може да създаде бисквитки със следните цели:
            </p>
            <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2 text-sm sm:text-base">
              <li>Бисквитки за производителност на сайта</li>
              <li>Бисквитки за анализиране на посетителите на сайта</li>
              <li>Бисквитки за географско насочване</li>
              <li>Бисквитки за регистрация</li>
              <li>Бисквитки за рекламна дейност</li>
              <li>Бисквитки на рекламодателите</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Как да контролирате бисквитките</h2>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Можете да контролирате и/или изтривате бисквитки когато пожелаете – за повече информация вижте <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-[#00BFA6] hover:text-[#00a08c] underline">aboutcookies.org</a>. Можете да изтриете всички бисквитки, които вече са запазени на вашия компютър, а също така можете да настроите повечето браузъри да ги блокират. Ако направите това обаче, може да се наложи ръчно да настройвате някои параметри всеки път, когато посещавате даден сайт, а освен това е възможно някои услуги и функции да не работят.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}