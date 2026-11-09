import { useState } from "react";
import { History, CheckCircle2, Search, Filter } from "lucide-react";

interface HistoryLogItem {
  id: string;
  date: string;
  truck: string;
  desc: string;
  pic: string;
  type: "ROTASI_GANDAR" | "GANTI_BARU" | "VULKANISIR" | "AFKIR";
}

const initialHistoryLogs: HistoryLogItem[] = [
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

export default function TireHistoryView() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredLogs = initialHistoryLogs.filter((log) => {
    const matchesSearch =
      log.truck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.pic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = typeFilter === "ALL" ? true : log.type === typeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
      {/* 1. Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Audit Trail Mutasi & Rotasi Roda
            </h3>
            <p className="text-xs text-slate-500">
              Histori lengkap pergantian posisi ban dari unit ke unit demi
              kepatuhan SOP
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari truk, serial, PIC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs font-semibold focus:bg-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 w-48"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-2.5 text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <Filter size={13} className="text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option value="ALL">Semua Aksi</option>
              <option value="ROTASI_GANDAR">Rotasi Gandar</option>
              <option value="GANTI_BARU">Ganti Baru</option>
              <option value="VULKANISIR">Vulkanisir</option>
              <option value="AFKIR">Afkir</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. List Log Card */}
      <div className="space-y-3 text-xs">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:bg-slate-50 transition">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {item.truck}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                      item.type === "ROTASI_GANDAR"
                        ? "bg-blue-100 text-blue-800"
                        : item.type === "GANTI_BARU"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.type === "VULKANISIR"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                    }`}>
                    {item.type.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • {item.date}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">{item.desc}</p>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Mekanik / PIC:{" "}
                  <strong className="text-slate-800">{item.pic}</strong>
                </p>
              </div>
              <CheckCircle2
                size={18}
                className="text-emerald-600 mt-1 shrink-0"
              />
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-slate-400 italic">
            Tidak ada riwayat mutasi yang cocok dengan pencarian.
          </div>
        )}
      </div>
    </div>
  );
}
