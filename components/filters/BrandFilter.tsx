import { Brand } from "@/types/product";

interface BrandFilterProps {
  brands: Brand[];
  selected: string[];
  onChange: (brandSlug: string, checked: boolean) => void;
}

export default function BrandFilter({
  brands,
  selected,
  onChange,
}: BrandFilterProps) {
  return (
    <div className="space-y-2">
      {brands.map((brand) => (
        <label
          key={brand.id}
          className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#F5F5F5] rounded transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(brand.slug)}
            onChange={(e) => onChange(brand.slug, e.target.checked)}
            className="w-4 h-4 text-[#00BFA6] bg-white border-2 border-[#E0E0E0] rounded cursor-pointer accent-[#00BFA6]"
          />
          <span className="text-[#333333] text-sm font-medium">
            {brand.name}
          </span>
        </label>
      ))}
    </div>
  );
}