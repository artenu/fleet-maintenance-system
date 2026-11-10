import { useState } from "react";
import { type TruckFleetTireItem } from "../data/mockTires";
import {
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

interface TireAuditScheduleViewProps {
  truckList: TruckFleetTireItem[];
  onRescheduleTruck: (truckId: string, reason: string, newDate: string) => void;
}

export default function TireAuditScheduleView({
  truckList,
  onRescheduleTruck,
}: TireAuditScheduleViewProps) {
  // State Modal Reschedule
  const [targetTruck, setTargetTruck] = useState<TruckFleetTireItem | null>(
    null,
  );
  const [rescheduleReason, setRescheduleReason] = useState<string>(
    "Unit sedang membawa kontainer ekspor ke Pelabuhan Belawan",
  );
  const [rescheduleDate, setRescheduleDate] = useState<string>("2026-11-05");

  const overdueCount = truckList.filter(
    (t) => t.auditSchedule.status === "OVERDUE",
  ).length;
  const rescheduledCount = truckList.filter(
    (t) => t.auditSchedule.status === "RESCHEDULED",
  ).length;

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTruck) {return;}

    onRescheduleTruck(targetTruck.id, rescheduleReason, rescheduleDate);
    setTargetTruck(null);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header SOP */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
            <CalendarClock size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Jadwal Audit Fisik Rutin & Izin Penundaan (Reschedule)
            </h3>
            <p className="text-xs text-slate-500">
              SOP PT ALN: Audit fisik wajib per 30 hari. Jika unit sedang jalan
              muatan kontainer, Kepala Pool dapat memberi dispensasi Reschedule.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Kartu KPI Status Kepatuhan */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Unit Armada
          </span>
          <strong className="text-xl font-extrabold text-slate-900 mt-1 block">
            {truckList.length} Unit
          </strong>
          <p className="text-slate-500 mt-0.5">Wajib audit berkala</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Status Overdue (Kritis)
          </span>
          <strong className="text-xl font-extrabold text-rose-600 mt-1 block">
            {overdueCount} Unit
          </strong>
          <p className="text-slate-500 mt-0.5">
            Perlu tindakan audit/reschedule
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Dalam Dispensasi (Rescheduled)
          </span>
          <strong className="text-xl font-extrabold text-blue-600 mt-1 block">
            {rescheduledCount} Unit
          </strong>
          <p className="text-slate-500 mt-0.5">Izin jalan kontainer aktif</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Audit Selesai / Terjadwal
          </span>
          <strong className="text-xl font-extrabold text-emerald-600 mt-1 block">
            {truckList.length - overdueCount} Unit
          </strong>
          <p className="text-slate-500 mt-0.5">Operasional normal</p>
        </div>
      </div>

      {/* 3. Tabel Status Audit Armada */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-slate-900">
            Daftar Jadwal Audit Fisik Unit Truk
          </h4>
          <span className="text-slate-400 text-[11px]">
            Siklus Audit Periode: <strong>Oktober / November 2026</strong>
          </span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[10px] font-extrabold">
            <tr>
              <th className="py-3 px-4">Kode Truk</th>
              <th className="py-3 px-4">Driver</th>
              <th className="py-3 px-4">Audit Terakhir</th>
              <th className="py-3 px-4">Jatuh Tempo</th>
              <th className="py-3 px-4">Status Kepatuhan</th>
              <th className="py-3 px-4">Surveyor PIC</th>
              <th className="py-3 px-4 text-right">Aksi Kepala Pool</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {truckList.map((truck) => (
              <tr key={truck.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4 font-black text-slate-900">
                  {truck.unitCode} ({truck.plateNumber})
                </td>
                <td className="py-3.5 px-4 text-slate-700 font-semibold">
                  {truck.driver}
                </td>
                <td className="py-3.5 px-4 text-slate-500">
                  {truck.auditSchedule.lastAuditDate}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {truck.auditSchedule.nextAuditSchedule}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      truck.auditSchedule.status === "OVERDUE"
                        ? "bg-rose-100 text-rose-700 animate-pulse"
                        : truck.auditSchedule.status === "RESCHEDULED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}>
                    {truck.auditSchedule.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  {truck.auditSchedule.surveyorName}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {truck.auditSchedule.status === "OVERDUE" ? (
                    <button
                      type="button"
                      onClick={() => setTargetTruck(truck)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 transition shadow-2xs">
                      Beri Izin Reschedule
                    </button>
                  ) : truck.auditSchedule.status === "RESCHEDULED" ? (
                    <span className="text-blue-700 font-bold text-[11px] flex items-center justify-end gap-1">
                      <Clock size={12} /> Diundur s/d{" "}
                      {truck.auditSchedule.nextAuditSchedule}
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                      <CheckCircle2 size={12} /> Terjadwal Aman
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup Reschedule */}
      {targetTruck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Dispensasi Penundaan Audit (Reschedule)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTargetTruck(null)}
                className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Berikan dispensasi penundaan audit untuk unit{" "}
              <strong>{targetTruck.unitCode}</strong> jika kendaraan sedang
              dalam perjalanan mengangkut kontainer.
            </p>

            <form
              onSubmit={handleConfirmReschedule}
              className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tanggal Baru Audit
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alasan Penundaan (Catatan Kepala Pool)
                </label>
                <textarea
                  rows={3}
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTargetTruck(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs">
                  Setujui Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
