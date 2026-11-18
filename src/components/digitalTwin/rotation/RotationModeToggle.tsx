// src/components/digitalTwin/rotation/RotationModeToggle.tsx
import { RotateCw, Warehouse } from "lucide-react";
import { Button } from "@/components/common";
import type { RotationModeToggleProps } from "@/types/DigitalTwinView/DigitalTwinViewTypes";

/**
 * Sakelar mode rotasi: Tukar Antar Roda Truk vs Ganti dari Stok Gudang
 */
export default function RotationModeToggle({
  mode,
  onChangeMode,
}: RotationModeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <Button
        type="button"
        variant={mode === "SWAP_POSITION" ? "primary" : "outline"}
        icon={RotateCw}
        onClick={() => onChangeMode("SWAP_POSITION")}
        className="w-full">
        Tukar Antar Roda Truk
      </Button>
      <Button
        type="button"
        variant={mode === "REPLACE_FROM_WAREHOUSE" ? "primary" : "outline"}
        icon={Warehouse}
        onClick={() => onChangeMode("REPLACE_FROM_WAREHOUSE")}
        className="w-full">
        Ganti dari Stok Gudang
      </Button>
    </div>
  );
}

