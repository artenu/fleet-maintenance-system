// ================= DATA MASTER DRIVER / PENGEMUDI (DARI API PUSAT) =================

export interface CentralDriverApiResponseItem {
  id: string;
  name: string;
  nickname: string;
  nik: string;
  birthDate: string;
  phone: string;
  licenseType: string; // contoh: "SIM B2 Umum"
  licenseExpiry: string; // contoh: "2031-10-08"
  status: "Aktif" | "Non-Aktif" | string;
  healthStatus: "Aman" | string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
}

export const mockCentralDriversApiResponse: CentralDriverApiResponseItem[] = [
  {
    id: "843d7ef3-dbd5-41d0-9d7f-c002d88c8eec",
    name: "Nursaepuloh",
    nickname: "Nur",
    nik: "3602180704910010",
    birthDate: "1991-04-07",
    phone: "0881-6822-319",
    licenseType: "SIM B2 Umum",
    licenseExpiry: "2031-10-08",
    status: "Aktif",
    healthStatus: "Aman",
    bankName: "SEABANK",
    bankAccountNumber: "901886616118",
    bankAccountHolder: "MOH. TOUFIK RAHMAN",
  },
  {
    id: "cd073bcf-60eb-4180-b86e-9d18604a1f0e",
    name: "Soleh Sutisna",
    nickname: "Soleh",
    nik: "3201381010750003",
    birthDate: "1975-10-11",
    phone: "0857-7215-1967",
    licenseType: "SIM B2 Umum",
    licenseExpiry: "2028-10-04",
    status: "Aktif",
    healthStatus: "Aman",
    bankName: "BCA",
    bankAccountNumber: "1290853504",
    bankAccountHolder: "Soleh Sutisna",
  },
  {
    id: "1177d9dc-7695-4077-a18c-9d3c90b2ec9d",
    name: "AGUS",
    nickname: "AGUS",
    nik: "3201391408750001",
    birthDate: "1975-08-14",
    phone: "0814-0051-2971",
    licenseType: "SIM B2 Umum",
    licenseExpiry: "2028-01-05",
    status: "Aktif",
    healthStatus: "Aman",
    bankName: "BCA",
    bankAccountNumber: "8730940352",
    bankAccountHolder: "AGUS",
  },
  {
    id: "3ff66719-5786-40e0-b981-69a49778a648",
    name: "DEDE SUPRIADI",
    nickname: "Dede",
    nik: "3201391509800002",
    birthDate: "1980-09-15",
    phone: "0812-9988-7711",
    licenseType: "SIM B2 Umum",
    licenseExpiry: "2029-05-12",
    status: "Aktif",
    healthStatus: "Aman",
  },
];
