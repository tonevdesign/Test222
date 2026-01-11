import { Home, ShoppingBag } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Large Text */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-[120px] xs:text-[150px] sm:text-[180px] md:text-[200px] font-bold text-[#00BFA6] opacity-20 leading-none">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 sm:mb-10 md:mb-12 -mt-16 sm:-mt-20">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-3 sm:mb-4 px-4">
            Страницата не бе намерена
          </h2>
          <p className="text-base sm:text-lg text-[#777777] max-w-md mx-auto px-4">
            Съжаляваме, но страницата, която търсите, не съществува или е била преместена.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
          <a
            href="/"
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-lg flex items-center justify-center gap-2 bg-[#00BFA6] !text-white hover:bg-[#00BFA6]/90 transition-all duration-200"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Начална страница
          </a>

          <a
            href="/products"
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-semibold rounded-lg flex items-center justify-center gap-2 border-2 border-[#00BFA6] text-[#00BFA6] hover:bg-[#00BFA6]/10 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            Разгледай продуктите
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;