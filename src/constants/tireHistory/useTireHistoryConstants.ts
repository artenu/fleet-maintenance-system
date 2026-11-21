// src/constants/tireHistory/useTireHistoryConstants.ts
import type { HistoryLogItem } from "@/types/TireHistoryView/TireHistoryViewTypes";

/**
 * Data awal transaksi riwayat mutasi & rotasi ban (Audit Trail)
 */
export const INITIAL_HISTORY_LOGS: HistoryLogItem[] = [
  {
    id: "LOG-001",
    date: "02 Nov 2026, 09:15",
    truck: "TRK-003",
    desc: "Rotasi Ban Serial GT-900101 dari Gandar Steer H1 dipindah ke Trailer C1 akibat keausan > 60.000 KM.",
    pic: "Slamet Riyadi (Mekanik Senior)",
    type: "ROTASI_GANDAR",
  },
  {
    id: "LOG-002",
    date: "24 Okt 2026, 14:30",
    truck: "TRK-001",
    desc: "Pemasangan Ban Baru R0 Bridgestone (BS-998821) ke gandar Steer H1 dari stok gudang pool.",
    pic: "Bambang Sudiro (Surveyor)",
    type: "GANTI_BARU",
  },
  {
    id: "LOG-003",
    date: "15 Okt 2026, 11:00",
    truck: "TRK-003",
    desc: "Pengiriman Ban Bekas BX-317 ke Rekanan Vulkanisir Karet Medan Boxer (Status R1 -> R2).",
    pic: "Eko Wahyudi (Admin Pool)",
    type: "VULKANISIR",
  },
  {
    id: "LOG-004",
    date: "05 Okt 2026, 16:45",
    truck: "TRK-001",
    desc: "Afkir total ban benjol dan kawat sobek di posisi C5. Ban dipindahkan ke area scrap.",
    pic: "Slamet Riyadi (Mekanik)",
    type: "AFKIR",
  },
];

// Alias untuk kompatibilitas
export const initialHistoryLogs = INITIAL_HISTORY_LOGS;
