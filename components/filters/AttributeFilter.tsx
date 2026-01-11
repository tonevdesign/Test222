import { Attribute } from "@/types/product";

interface AttributeFilterProps {
  attribute: Attribute;
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
}

export default function AttributeFilter({
  attribute,
  selected,
  onChange,
}: AttributeFilterProps) {
  // For color attributes, show colored circles
  if (attribute.type === "color" && attribute.values) {
    return (
      <div className="flex flex-wrap gap-3">
        {attribute.values.map((value) => {
          // Always use lowercase for consistency with backend
          const val = value.value.toLowerCase();
          return (
            <label
              key={value.id}
              className="cursor-pointer relative group"
              title={value.value}
            >
              <input
                type="checkbox"
                checked={selected.includes(val)}
                onChange={(e) => onChange(val, e.target.checked)}
                className="sr-only peer"
              />
              <div
                className="w-8 h-8 rounded-full border-3 border-[#E0E0E0] peer-checked:border-[#00BFA6] transition-all cursor-pointer hover:scale-110"
                style={{
                  backgroundColor: value.value.startsWith("#")
                    ? value.value
                    : `var(--color-${val}, #999)`,
                }}
              />
            </label>
          );
        })}
      </div>
    );
  }

  // For regular attributes (checkboxes) - ALWAYS USE LOWERCASE
  return (
    <div className="space-y-2">
      {attribute.values?.map((value) => {
        // Convert to lowercase for consistency with backend
        const val = value.value.toLowerCase();
        return (
          <label
            key={value.id}
            className="flex items-center gap-3 cursor-pointer p-2 hover:bg-[#F5F5F5] rounded transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(val)}
              onChange={(e) => onChange(val, e.target.checked)}
              className="w-4 h-4 text-[#00BFA6] bg-white border-2 border-[#E0E0E0] rounded cursor-pointer accent-[#00BFA6]"
            />
            {/* Display original case for readability */}
            <span className="text-[#333333] text-sm font-medium">{value.value}</span>
          </label>
        );
      })}
    </div>
  );
}