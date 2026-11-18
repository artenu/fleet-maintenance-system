// src/components/vehicleInspection/StatusPillGroup.tsx
interface StatusOption<T extends string> {
  value: T;
  label: string;
}

interface StatusPillGroupProps<T extends string> {
  options: Array<StatusOption<T>>;
  activeValue: T;
  onChange: (value: T) => void;
  size?: "sm" | "xs";
}

export default function StatusPillGroup<T extends string>({
  options,
  activeValue,
  onChange,
}: StatusPillGroupProps<T>) {
  return (
    <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
      {options.map((opt) => {
        const isSelected = activeValue === opt.value;

        // Tentukan warna saat aktif berdasarkan status
        let activeBg = "bg-slate-700 text-white";
        if (opt.value === "B") {
          activeBg = "bg-emerald-600 text-white shadow-xs";
        } else if (opt.value === "RM") {
          activeBg = "bg-amber-600 text-white shadow-xs";
        } else if (
          opt.value === "R" ||
          opt.value === "RB" ||
          opt.value === "H"
        ) {
          activeBg = "bg-rose-600 text-white shadow-xs";
        }

        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition-all ${
              isSelected
                ? activeBg
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}>
            {opt.value}
          </button>
        );
      })}
    </div>
  );
}
