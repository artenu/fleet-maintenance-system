// src/types/auth.ts

export type UserRole = "SURVEYOR" | "MECHANIC" | "ADMIN" | "FINANCE";

export interface AuthUser {
  id: string;
  nik: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatarUrl?: string;
  poolLocation: string;
}

/**
 * Mock Akun Login Surveyor Aktif
 * Sesuai MOM 4-11-2026: Nama surveyor tidak lagi diinput manual,
 * melainkan dibaca langsung dari session akun yang sedang login.
 */
export const mockCurrentSurveyor: AuthUser = {
  id: "USR-SRV-042",
  nik: "SRV-2026-042",
  name: "Budi Santoso",
  role: "SURVEYOR",
  roleLabel: "Surveyor Lapangan PT ALN",
  poolLocation: "Pool Cakung - Jakarta Timur",
};

/**
 * Mock Akun Lain untuk Simulasi Uji Coba RBAC
 */
export const mockUsersByRole: Record<UserRole, AuthUser> = {
  SURVEYOR: mockCurrentSurveyor,
  MECHANIC: {
    id: "USR-MECH-012",
    nik: "MEC-2026-012",
    name: "Agus Supriyadi",
    role: "MECHANIC",
    roleLabel: "Mekanik Senior Roda & Sasis",
    poolLocation: "Pool Cakung - Jakarta Timur",
  },
  ADMIN: {
    id: "USR-ADM-001",
    nik: "ADM-2026-001",
    name: "Dewi Anggraini",
    role: "ADMIN",
    roleLabel: "Admin Operasional Fleet",
    poolLocation: "Head Office PT ALN",
  },
  FINANCE: {
    id: "USR-FIN-003",
    nik: "FIN-2026-003",
    name: "Rudi Hermawan",
    role: "FINANCE",
    roleLabel: "Finance & Purchasing Ban",
    poolLocation: "Head Office PT ALN",
  },
};
