import { Truck, RotateCcw, TrendingUp } from 'lucide-react';

export function ShippingInfo() {
  return (
    <div className="space-y-2.5 sm:space-y-3 p-3 sm:p-4 bg-[#F5F5F5] rounded-lg">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Truck size={18} className="sm:w-5 sm:h-5 text-[#00BFA6] flex-shrink-0" />
        <div>
          <p className="font-semibold text-[#1F1F1F] text-sm sm:text-base">Безплатна доставка</p>
          <p className="text-[10px] sm:text-xs text-[#777777]">При поръчки над 100 €</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <RotateCcw size={18} className="sm:w-5 sm:h-5 text-[#00BFA6] flex-shrink-0" />
        <div>
          <p className="font-semibold text-[#1F1F1F] text-sm sm:text-base">14-дневен срок за връщане</p>
          <p className="text-[10px] sm:text-xs text-[#777777]">Без въпроси</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <TrendingUp size={18} className="sm:w-5 sm:h-5 text-[#00BFA6] flex-shrink-0" />
        <div>
          <p className="font-semibold text-[#1F1F1F] text-sm sm:text-base">Гарантирано качество</p>
          <p className="text-[10px] sm:text-xs text-[#777777]">На разумни цени</p>
        </div>
      </div>
    </div>
  );
}