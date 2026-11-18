// src/hooks/useVehicleInspection.ts
import { useState, useMemo, type ChangeEvent } from "react";
import { mockCurrentSurveyor } from "@/types/auth/auth";
import { mockTruckTireList } from "@/data/mockTires";
import { mockChassisPoolList } from "@/data/mockChassisPool";
import {
  INITIAL_TOOL_DOC_ITEMS,
  INITIAL_PHYSICAL_CHECK_ITEMS,
  DEFAULT_BATTERY_CHECK,
  DEFAULT_INSPECTION_LOCATIONS,
} from "@/constants/vehicleInspection";
import type {
  ToolDocItem,
  ToolDocStatus,
  PhysicalCheckItem,
  ComponentConditionStatus,
  BatteryCheckData,
  VehicleInspectionHeader,
  VehicleInspectionRecord,
  InspectionTab,
  PhysicalSectionFilter,
  UseVehicleInspectionProps,
} from "@/types/vehicleInspection";

export function useVehicleInspection({
  initialUnitCode = "TRK-001",
  onSaveRecord,
}: UseVehicleInspectionProps = {}) {
  // Tab Aktif
  const [activeTab, setActiveTab] = useState<InspectionTab>("HEADER");
  const [physicalSection, setPhysicalSection] =
    useState<PhysicalSectionFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Ambil data unit awal & sasis aktifnya langsung dari database
  const initialTruck =
    mockTruckTireList.find((t) => t.unitCode === initialUnitCode) ||
    mockTruckTireList[0];
  const initialChassis = mockChassisPoolList.find(
    (c) => c.attachedHeadId === initialTruck.id,
  );

  // 1. STATE HEADER INFORMASI UNIT & SURVEYOR (Auto-Auth NIK)
  const [header, setHeader] = useState<VehicleInspectionHeader>({
    unitCode: initialUnitCode,
    plateNumber: initialTruck.plateNumber,
    chassisCode: initialChassis?.chassisCode || "",
    chassisLengthCategory: initialTruck.capacity || "",
    chassisType: initialTruck.chassisType || "",
    odometer: initialTruck.currentOdometer || 0,
    driverName: initialTruck.driver || "",
    mechanicName: `${mockCurrentSurveyor.name} (Mekanik & Surveyor)`,
    inspectorName: mockCurrentSurveyor.name,
    inspectorNik: mockCurrentSurveyor.nik,
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionTime: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: DEFAULT_INSPECTION_LOCATIONS[0],
  });

  // 2. STATE SEKSI 1: TOOLS & DOKUMEN (12 Item)
  const [toolDocs, setToolDocs] = useState<ToolDocItem[]>(
    INITIAL_TOOL_DOC_ITEMS,
  );

  // 3. STATE SEKSI 2: PEMERIKSAAN FISIK BODY (50 Item)
  const [physicalChecks, setPhysicalChecks] = useState<PhysicalCheckItem[]>(
    INITIAL_PHYSICAL_CHECK_ITEMS,
  );

  // 4. STATE SEKSI 3: AKI / BATTERY (Aki 1, Aki 2 & Gembok Case)
  const [battery, setBattery] = useState<BatteryCheckData>(
    DEFAULT_BATTERY_CHECK,
  );

  // 5. STATE SEKSI 4: SOP FOTO SUPIR & CATATAN KESELURUHAN
  const [driverPhotoUrl, setDriverPhotoUrl] = useState<string | null>(null);
  const [overallNotes, setOverallNotes] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedRecord, setSubmittedRecord] =
    useState<VehicleInspectionRecord | null>(null);

  // ================= HANDLERS HEADER =================
  const updateHeader = (patch: Partial<VehicleInspectionHeader>) => {
    setHeader((prev) => ({ ...prev, ...patch }));
  };

  // 👇 TARUH DI SINI: Handler Pilih Unit dari Database
  const handleSelectTruckFromDatabase = (selectedUnitCode: string) => {
    const truck = mockTruckTireList.find(
      (t) => t.unitCode === selectedUnitCode,
    );
    if (!truck) {
      return;
    }

    // Cari sasis yang sedang aktif digandeng oleh unit ini di pool
    const activeChassis = mockChassisPoolList.find(
      (c) => c.attachedHeadId === truck.id,
    );

    setHeader((prev) => ({
      ...prev,
      unitCode: truck.unitCode,
      plateNumber: truck.plateNumber,
      driverName: truck.driver,
      odometer: truck.currentOdometer,
      chassisCode: activeChassis
        ? activeChassis.chassisCode
        : `CHS-${truck.unitCode}`,
      chassisLengthCategory: activeChassis
        ? activeChassis.lengthCategory
        : truck.capacity,
      chassisType: activeChassis ? activeChassis.type : truck.chassisType,
      // Mekanik merangkap sebagai Surveyor PIC
      mechanicName: `${mockCurrentSurveyor.name} (Mekanik & Surveyor)`,
      inspectorName: mockCurrentSurveyor.name,
      inspectorNik: mockCurrentSurveyor.nik,
      inspectionDate: new Date().toISOString().split("T")[0],
      inspectionTime: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  };

  // ================= HANDLERS SEKSI 1: TOOLS & DOKUMEN =================
  const updateToolDocStatus = (id: string, status: ToolDocStatus) => {
    setToolDocs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const updateToolDocExpiry = (id: string, expiryDate: string) => {
    setToolDocs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expiryDate } : item)),
    );
  };

  const updateToolDocNotes = (id: string, notes: string) => {
    setToolDocs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item)),
    );
  };

  // ================= HANDLERS SEKSI 2: FISIK BODY (50 ITEM) =================
  const updatePhysicalCheckStatus = (
    id: string,
    status: ComponentConditionStatus,
  ) => {
    setPhysicalChecks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const updatePhysicalCheckNotes = (id: string, notes: string) => {
    setPhysicalChecks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item)),
    );
  };

  // Fitur 1-Klik: Setel Semua Fisik Baik (All Good)
  const setAllPhysicalChecksGood = () => {
    setPhysicalChecks((prev) =>
      prev.map((item) => ({ ...item, status: "B", notes: "" })),
    );
  };

  // ================= HANDLERS SEKSI 3: AKI =================
  const updateBattery = (patch: Partial<BatteryCheckData>) => {
    setBattery((prev) => ({ ...prev, ...patch }));
  };

  // ================= HANDLERS SEKSI 4: SOP FOTO SUPIR =================
  const handleDriverPhotoCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDriverPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDriverPhoto = () => {
    setDriverPhotoUrl(null);
  };

  // ================= FILTER & SEARCH FISIK =================
  const filteredPhysicalChecks = useMemo(() => {
    return physicalChecks.filter((item) => {
      const matchesSection =
        physicalSection === "ALL" ? true : item.section === physicalSection;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesSection && matchesSearch;
    });
  }, [physicalChecks, physicalSection, searchQuery]);

  // ================= METRIK & AGREGASI CACAT =================
  const metrics = useMemo(() => {
    const damagedComponents = physicalChecks.filter(
      (c) => c.status === "RM" || c.status === "RB" || c.status === "H",
    );
    const missingTools = toolDocs.filter(
      (t) => t.status === "H" || t.status === "T",
    );
    const damagedTools = toolDocs.filter((t) => t.status === "R");
    const batteryIssues =
      battery.battery1.condition !== "B" ||
      battery.battery2.condition !== "B" ||
      !battery.caseLockedWithChain;

    const isFitForOperation =
      damagedComponents.length === 0 &&
      missingTools.length === 0 &&
      !batteryIssues;

    return {
      totalDefectsCount:
        damagedComponents.length + missingTools.length + damagedTools.length,
      damagedComponentsCount: damagedComponents.length,
      missingToolsCount: missingTools.length,
      damagedToolsCount: damagedTools.length,
      hasBatteryIssues: batteryIssues,
      isFitForOperation,
      // SOP Wajib: Harus ada foto pengemudi sebelum bisa disahkan
      hasDriverPhoto: Boolean(driverPhotoUrl),
    };
  }, [physicalChecks, toolDocs, battery, driverPhotoUrl]);

  // ================= FINAL SUBMIT =================
  const handleSubmitInspection = () => {
    const record: VehicleInspectionRecord = {
      id: `BAP-${header.unitCode}-${Date.now().toString().slice(-6)}`,
      header,
      toolDocs,
      physicalChecks,
      battery,
      driverPhotoUrl,
      overallNotes,
      status: "SUBMITTED",
      submittedAt: new Date().toISOString(),
    };

    setSubmittedRecord(record);
    setIsSubmitted(true);

    if (onSaveRecord) {
      onSaveRecord(record);
    }
  };

  const handleResetForm = () => {
    setToolDocs(INITIAL_TOOL_DOC_ITEMS);
    setPhysicalChecks(INITIAL_PHYSICAL_CHECK_ITEMS);
    setBattery(DEFAULT_BATTERY_CHECK);
    setDriverPhotoUrl(null);
    setOverallNotes("");
    setIsSubmitted(false);
    setSubmittedRecord(null);
    setActiveTab("HEADER");
  };

  return {
    activeTab,
    setActiveTab,
    physicalSection,
    setPhysicalSection,
    searchQuery,
    setSearchQuery,
    header,
    updateHeader,
    handleSelectTruckFromDatabase,
    truckOptions: mockTruckTireList.map((t) => ({
      value: t.unitCode,
      label: `${t.unitCode} • ${t.plateNumber} (${t.brand})`,
      subLabel: `Supir: ${t.driver} • ${t.capacity}`,
    })),
    toolDocs,
    updateToolDocStatus,
    updateToolDocExpiry,
    updateToolDocNotes,
    physicalChecks: filteredPhysicalChecks,
    allPhysicalChecks: physicalChecks,
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
  };
}
