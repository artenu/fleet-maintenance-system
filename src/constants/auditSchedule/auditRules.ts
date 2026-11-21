// src/constants/auditSchedule/auditRules.ts

/**
 * Aturan SOP Audit Fisik Bulanan PT ALN
 */
export const AUDIT_RULES = {
  CYCLE_DAYS: 30, // Audit berikutnya = tanggal audit terakhir + 30 hari
  DUE_SOON_DAYS: 3, // Peringatan "Segera Jatuh Tempo" mulai H-3
};
