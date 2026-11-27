// src/views/VehicleInspectionView.tsx
import { Printer, CheckCircle2, FileCheck2 } from "lucide-react";
import { Container } from "@/components/layout";
import { Button, Badge } from "@/components/common";
import { useVehicleInspection } from "@/hooks/useVehicleInspection";
import { INSPECTION_TABS } from "@/constants/vehicleInspection/vehicleInspectionConstants";
import { DateInput } from "@/components/forms";

// 🧱 Komponen Sub-Seksi Form
import {
  InspectionHeaderCard,
  ToolsDocumentSection,
  PhysicalComponentsSection,
  BatteryCheckSection,
  DriverPhotoConfirmation,
} from "@/components/vehicleInspection";

interface VehicleInspectionViewProps {
  onSuccessSubmit?: (unitCode: string) => void;
}

export default function VehicleInspectionView({
  onSuccessSubmit,
}: VehicleInspectionViewProps) {
  const {
    activeTab,
    setActiveTab,
    physicalSection,
    setPhysicalSection,
    searchQuery,
    setSearchQuery,
    header,
    updateHeader,
    handleSelectTruckFromDatabase,
    truckOptions,
    toolDocs,
    updateToolDocStatus,
    updateToolDocExpiry,
    updateToolDocNotes,
    physicalChecks,
    allPhysicalChecks,
    updatePhysicalCheckStatus,
    updatePhysicalCheckNotes,
    setAllPhysicalChecksGood,
    battery,
    updateBattery,
    driverPhotoUrl,
    handleDriverPhotoCapture,
    removeDriverPhoto,
    overallNotes,
    setOverallNotes,
    metrics,
    isSubmitted,
    submittedRecord,
    handleSubmitInspection,
    handleResetForm,
  } = useVehicleInspection({
    onSaveRecord: (record) => {
      if (onSuccessSubmit) {
        onSuccessSubmit(record.header.unitCode);
      }
    },
  });

  const handlePrintBAP = () => {
    window.print();
  };

  const currentTabIndex = INSPECTION_TABS.findIndex(
    (tab) => tab.id === activeTab,
  );
  const prevTab =
    currentTabIndex > 0 ? INSPECTION_TABS[currentTabIndex - 1] : null;
  const nextTab =
    currentTabIndex < INSPECTION_TABS.length - 1
      ? INSPECTION_TABS[currentTabIndex + 1]
      : null;

  return (
    <Container className="space-y-5 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Banner & Navigasi Cepat */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <FileCheck2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Pemeriksaan Fisik Unit & Sasis PT ALN
              </h2>
              <Badge variant="info" className="text-[10px] font-bold">
                Pilar 3
              </Badge>
              {isSubmitted && (
                <Badge variant="success" className="text-[10px] font-bold">
                  BAP Terbit
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulir digital walkaround sebelum keberangkatan truk (Pre-Trip
              Inspection)
            </p>
          </div>
        </div>

        {/* Action Button & Tanggal Inspeksi */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-56">
            <DateInput
              label="Tanggal Inspeksi Truk"
              value={header.inspectionDate}
              onChange={(e) => updateHeader({ inspectionDate: e.target.value })}
              helperText="Waktu pelaksanaan inspeksi oleh surveyor"
              className="py-1.5 text-xs"
              required
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrintBAP}
            className="text-xs font-bold">
            <Printer size={14} className="mr-1.5 text-slate-600" />
            Cetak Form A4
          </Button>
        </div>
      </div>

      {/* 2. Stepper Tab Navigasi Form 5 Langkah */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {INSPECTION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant={isActive ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 justify-start text-left w-full transition-all ${
                isActive ? "!bg-blue-600" : "bg-white"
              }`}>
              <div
                className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-black shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}>
                <Icon size={14} />
              </div>
              <div className="min-w-0">
                <span
                  className={`block text-[10px] font-bold uppercase tracking-wider ${
                    isActive ? "text-blue-100" : "text-slate-400"
                  }`}>
                  Langkah {tab.step}
                </span>
                <span className="block text-xs font-bold truncate">
                  {tab.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>

      {/* 3. Konten Formulir Berdasarkan Tab Aktif */}
      <div className="space-y-5">
        {activeTab === "HEADER" && (
          <InspectionHeaderCard
            header={header}
            onSelectTruck={handleSelectTruckFromDatabase}
            truckOptions={truckOptions}
            onChangeHeader={updateHeader}
          />
        )}

        {activeTab === "TOOLS" && (
          <ToolsDocumentSection
            toolDocs={toolDocs}
            onUpdateStatus={updateToolDocStatus}
            onUpdateExpiry={updateToolDocExpiry}
            onUpdateNotes={updateToolDocNotes}
          />
        )}

        {activeTab === "PHYSICAL" && (
          <PhysicalComponentsSection
            items={physicalChecks}
            allItems={allPhysicalChecks}
            currentSection={physicalSection}
            searchQuery={searchQuery}
            onChangeSection={setPhysicalSection}
            onChangeSearch={setSearchQuery}
            onUpdateStatus={updatePhysicalCheckStatus}
            onUpdateNotes={updatePhysicalCheckNotes}
            onSetAllGood={setAllPhysicalChecksGood}
          />
        )}

        {activeTab === "BATTERY" && (
          <BatteryCheckSection
            battery={battery}
            onChangeBattery={updateBattery}
          />
        )}

        {activeTab === "CONFIRMATION" && (
          <DriverPhotoConfirmation
            header={header}
            driverPhotoUrl={driverPhotoUrl}
            onPhotoCapture={handleDriverPhotoCapture}
            onRemovePhoto={removeDriverPhoto}
            overallNotes={overallNotes}
            onChangeOverallNotes={setOverallNotes}
            metrics={metrics}
            isSubmitted={isSubmitted}
            onSubmit={handleSubmitInspection}
            onReset={handleResetForm}
          />
        )}

        {/* 4. Universal Step Navigation Buttons (Dinamis dari TABS) */}
        <div className="flex items-center justify-between pt-2">
          {prevTab ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab(prevTab.id)}
              className="text-xs font-bold">
              ← Kembali ke {prevTab.label}
            </Button>
          ) : (
            <div /> /* Spacer agar tombol lanjut tetap di kanan saat tab pertama */
          )}

          {nextTab && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setActiveTab(nextTab.id)}
              className="text-xs font-bold text-white">
              Lanjut ke {nextTab.label} →
            </Button>
          )}
        </div>
      </div>

      {/* 4. Notifikasi Banner Jika BAP Sudah Disahkan */}
      {isSubmitted && submittedRecord && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-900">
                BAP Inspeksi Fisik #{submittedRecord.id} Berhasil Disahkan!
              </p>
              <p className="text-xs text-emerald-700">
                Data tersimpan ke sistem. Dokumen BAP siap dicetak untuk arsip
                pool dan supir.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handlePrintBAP}
            className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white">
            <Printer size={14} className="mr-1.5" />
            Cetak Salinan BAP Sekarang
          </Button>
        </div>
      )}
    </Container>
  );
}
