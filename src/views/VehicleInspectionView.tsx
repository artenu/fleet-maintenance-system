// src/views/VehicleInspectionView.tsx
import {
  Truck,
  Wrench,
  SlidersHorizontal,
  Zap,
  Camera,
  Printer,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { Container } from "@/components/layout";
import { Button, Badge } from "@/components/common";
import { useVehicleInspection } from "@/hooks/useVehicleInspection";
import type { InspectionTab } from "@/types/vehicleInspection";

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

const TABS: Array<{
  id: InspectionTab;
  label: string;
  icon: typeof Truck;
  step: number;
}> = [
  { id: "HEADER", label: "Identitas Unit", icon: Truck, step: 1 },
  { id: "TOOLS", label: "Tools & Dokumen", icon: Wrench, step: 2 },
  { id: "PHYSICAL", label: "50 Item Fisik", icon: SlidersHorizontal, step: 3 },
  { id: "BATTERY", label: "Cek Aki 24V", icon: Zap, step: 4 },
  { id: "CONFIRMATION", label: "Foto & BAP", icon: Camera, step: 5 },
];

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

        {/* Action Button: Print BAP A4 */}
        <div className="flex items-center gap-2">
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
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                isActive
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
                    isActive ? "text-slate-300" : "text-slate-400"
                  }`}>
                  Langkah {tab.step}
                </span>
                <span className="block text-xs font-bold truncate">
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Konten Formulir Berdasarkan Tab Aktif */}
      <div className="space-y-5">
        {activeTab === "HEADER" && (
          <div className="space-y-4">
            <InspectionHeaderCard
              header={header}
              onSelectTruck={handleSelectTruckFromDatabase}
              truckOptions={truckOptions}
              onChangeHeader={updateHeader}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveTab("TOOLS")}
                className="text-xs font-bold bg-blue-600 text-white">
                Lanjut ke Tools & Dokumen →
              </Button>
            </div>
          </div>
        )}

        {activeTab === "TOOLS" && (
          <div className="space-y-4">
            <ToolsDocumentSection
              toolDocs={toolDocs}
              onUpdateStatus={updateToolDocStatus}
              onUpdateExpiry={updateToolDocExpiry}
              onUpdateNotes={updateToolDocNotes}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("HEADER")}
                className="text-xs font-bold">
                ← Kembali ke Identitas
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveTab("PHYSICAL")}
                className="text-xs font-bold bg-blue-600 text-white">
                Lanjut ke 50 Item Fisik →
              </Button>
            </div>
          </div>
        )}

        {activeTab === "PHYSICAL" && (
          <div className="space-y-4">
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
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("TOOLS")}
                className="text-xs font-bold">
                ← Kembali ke Tools
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveTab("BATTERY")}
                className="text-xs font-bold bg-blue-600 text-white">
                Lanjut ke Cek Aki 24V →
              </Button>
            </div>
          </div>
        )}

        {activeTab === "BATTERY" && (
          <div className="space-y-4">
            <BatteryCheckSection
              battery={battery}
              onChangeBattery={updateBattery}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("PHYSICAL")}
                className="text-xs font-bold">
                ← Kembali ke 50 Item Fisik
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveTab("CONFIRMATION")}
                className="text-xs font-bold bg-blue-600 text-white">
                Lanjut ke Foto Supir & Pengesahan →
              </Button>
            </div>
          </div>
        )}

        {activeTab === "CONFIRMATION" && (
          <div className="space-y-4">
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
            <div className="flex justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("BATTERY")}
                className="text-xs font-bold">
                ← Kembali ke Cek Aki
              </Button>
            </div>
          </div>
        )}
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
