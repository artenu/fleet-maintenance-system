# FMS — Fleet Maintenance System

Aplikasi web untuk **pemeliharaan armada dan manajemen siklus hidup ban truk** di Pool & Workshop **PT Armada Lintas Nusantara (ALN)**. Dikembangkan oleh **PT Arta Teknologi (Artenu)**.

> **Status:** Frontend aktif dikembangkan. Seluruh data masih memakai **mock data** (`src/data/`) — integrasi backend (PostgreSQL + REST API) dan Hino Connect live dijadwalkan di fase berikutnya.

---

## Daftar Isi

1. [Tujuan Aplikasi](#1-tujuan-aplikasi)
2. [Pengguna & Hak Akses](#2-pengguna--hak-akses)
3. [Fitur Utama](#3-fitur-utama)
4. [Aturan Bisnis (Golden Rules)](#4-aturan-bisnis-golden-rules)
5. [Tech Stack](#5-tech-stack)
6. [Struktur Proyek](#6-struktur-proyek)
7. [Menjalankan Proyek](#7-menjalankan-proyek)
8. [Konvensi Kode](#8-konvensi-kode)
9. [Roadmap](#9-roadmap)
10. [Dokumen Terkait](#10-dokumen-terkait)

---

## 1. Tujuan Aplikasi

Sebelumnya, pengecekan kondisi ban dan fisik truk di PT ALN dilakukan dengan **formulir kertas** dan rekap **Excel**. Akibatnya:

- Riwayat ban per nomor seri (kapan dipasang, divulkanisir, dirotasi, di odometer berapa) sulit dilacak.
- Keputusan ganti ban bergantung pada penilaian manual, tanpa membandingkan jarak tempuh (odometer) dengan kondisi fisik.
- Jadwal audit bulanan mudah terlewat, terutama untuk unit yang sedang menjalankan job kontainer.
- Manajemen tidak punya gambaran real-time unit mana yang **layak jalan** dan mana yang **harus ditahan di pool**.

**FMS hadir untuk:**

1. **Mendigitalkan** form inspeksi ban & fisik unit milik surveyor.
2. **Mendeteksi otomatis** kesehatan setiap ban berdasarkan odometer (Hino Connect IoT), kondisi fisik, merk, status vulkanisir, riwayat tambal, dan masa kedaluwarsa.
3. **Menegakkan SOP keselamatan** (aturan gandar kemudi, batas vulkanisir, batas fisik kritis) langsung di sistem.
4. **Menentukan kelaikan jalan** unit: *Fit to Dispatch* vs *Grounded*.
5. **Mencatat jejak audit** setiap mutasi, rotasi, dan pemasangan ban.
6. **Menyediakan analitik biaya** (Cost-Per-Kilometer) untuk keputusan pembelian merk ban.

---

## 2. Pengguna & Hak Akses

| Peran | Kebutuhan Utama |
|---|---|
| **Surveyor** | Melakukan audit ban bulanan & pemeriksaan fisik unit (pre-trip walkaround). Nama surveyor dibaca otomatis dari akun login, tidak diinput manual. |
| **Mekanik** | Memasang, merotasi, dan mengganti ban; memberi toleransi +5.000 KM (wajib bukti foto). |
| **Kepala Pool** | Memberi dispensasi penundaan audit untuk unit yang sedang menjalankan job. |
| **Admin / Finance** | Mengelola stok gudang ban; satu-satunya peran yang dapat melihat **harga beli & biaya jasa** ban (RBAC). |
| **Manajemen** | Memantau kesehatan seluruh armada dan analitik biaya. |

> Autentikasi saat ini masih mock (`src/types/auth/auth.ts`).

---

## 3. Fitur Utama

Aplikasi terdiri dari 9 halaman (dipilih melalui sidebar):

### 3.1 Executive Fleet Health Dashboard
Ringkasan kesehatan seluruh armada: jumlah unit *Fit to Dispatch* vs *Grounded*, kondisi fisik ban terendah, status sasis terpasang, dan unit dengan audit overdue.

### 3.2 Digital Twin & Visualizer Roda
- Denah visual roda per unit: **Bobtail (6 roda)**, **2 sumbu (14 roda)**, **3 sumbu (18 roda)**, plus ban serep **S1**.
- Warna status per roda: **Prima** (hijau), **Perhatian** (kuning), **Kritis** (merah).
- **Banner Kelaikan Jalan**: unit otomatis **GROUNDED** jika belum ada ban, ada ban kritis, atau ban belum lengkap. Ban serep kosong tidak menahan unit.
- Panel detail roda: KM tempuh, sisa KM, keausan, pelanggaran (blokir) & peringatan (non-blokir), foto bukti.
- Aksi: **inspeksi ban** (multi-foto, tanggal inspeksi, jumlah tambal per siklus vulkanisir), **rotasi / mutasi**, **pasang ban dari gudang**, **pindah ban antar slot / antar truk**, **emergency swap ban serep**, dan **toleransi mekanik +5.000 KM**.
- Deteksi otomatis unit baru (0 ban) atau ban belum lengkap di seluruh database.

### 3.3 Update Kondisi Ban & Cek Fisik Roda
Form pendaftaran unit truk baru dari data master (API pusat) beserta kondisi awal setiap ban.

### 3.4 Manajemen Perangkaian Armada (Drop & Hook)
Kepala truk (*tractor head*) dan sasis trailer dikelola terpisah. Sasis dapat dipasang/dilepas, dan konfigurasi roda (14/18) otomatis mengikuti sasis yang terpasang.

### 3.5 Master Stok & Gudang Ban
Inventaris ban di gudang pool, penerimaan ban baru (harga hanya tampil untuk Admin/Finance), dan informasi masa kedaluwarsa ban gudang.

### 3.6 Log Mutasi & Rotasi Ban
Jejak audit setiap rotasi gandar, pemasangan ban baru, vulkanisir, dan afkir.

### 3.7 Analitik Biaya & Durabilitas Merk (CPK)
Perbandingan **Cost-Per-Kilometer** antar merk ban, merk paling efisien, serta leaderboard biaya & umur pakai per unit truk.

### 3.8 Jadwal Audit Fisik & Penundaan Izin
- Siklus audit **30 hari** per unit.
- Status dihitung otomatis dari tanggal: **OVERDUE**, **SEGERA JATUH TEMPO** (H-3), **DISPENSASI**, **SUDAH DIAUDIT**, **BELUM DIAUDIT**.
- **Dispensasi berbasis jumlah hari** dengan preview tanggal baru — untuk unit dengan job deadline ketat. Jatuh tempo asli tetap tersimpan.
- **Audit selesai otomatis** setelah seluruh ban terpasang selesai diinspeksi; jadwal berikutnya +30 hari.

### 3.9 Pemeriksaan Fisik Unit & Sasis (Pre-Trip Walkaround)
Digitalisasi form fisik PT ALN (di luar ban): tools & dokumen (dengan tanggal expired), body/kabin/lampu/sasis, cek aki, **SOP foto pengemudi di depan unit**, ringkasan *Fit for Dispatch*, dan **cetak form A4**.

---

## 4. Aturan Bisnis (Golden Rules)

| No | Parameter | Aturan | Tindakan Sistem |
|:-:|---|---|---|
| 1 | **Gandar Kemudi (Steer H1/H2)** | Hanya ban baru (R0) atau 1x vulkanisir (R1). | R1 → peringatan. R2/R3/AFKIR → pelanggaran (Kritis). |
| 2 | **Interval Steer** | 60.000 KM × toleransi merk. | Kritis jika KM tempuh ≥ batas. |
| 3 | **Interval Drive & Trailer** | 25.000 KM × toleransi merk. | Kritis jika KM tempuh ≥ batas. |
| 4 | **Batas Vulkanisir** | Maksimal 3x (R0 → R1 → R2 → R3 → AFKIR). | Opsi vulkanisir terkunci setelah R3. |
| 5 | **Kondisi Fisik Kritis** | Fisik surveyor < 40%. | Langsung Kritis, mengabaikan KM. |
| 6 | **Ambang Peringatan** | KM ≥ 80% batas atau fisik ≤ 70%. | Status Perhatian (kuning). |
| 7 | **Toleransi Mekanik** | Mekanik dapat menambah +5.000 KM. | Wajib nama mekanik, alasan, dan **bukti foto**. |
| 8 | **Riwayat Tambal / Bocor** | Dihitung per siklus (R0–R3). | 2x → peringatan. 3x → wajib AFKIR (tidak boleh di-retread). |
| 9 | **Kedaluwarsa Ban** | Ban baru terpakai: 1 tahun sejak pasang. Ban gudang tidak terpakai: 5 tahun sejak masuk. | Peringatan H-30, pelanggaran jika lewat. |
| 10 | **Audit Bulanan** | Setiap unit diaudit per 30 hari; job kontainer diprioritaskan. | Dispensasi tanpa false alarm; peringatan H-3. |
| 11 | **Profil Merk** | Merk premium lebih awet. | Multiplier toleransi KM: Michelin 1.2, Bridgestone / Super Grip 1.15, Tier 2 1.0, Budget 0.8. |
| 12 | **Tekanan Angin** | Rentang normal 95–130 PSI. | Di luar rentang → peringatan saat inspeksi. |

**Odometer Hino Connect:** nilai IoT dalam **meter**, dikonversi ke KM (`Math.round(odometer / 1000)`), dicocokkan ke unit via **VIN**.

---

## 5. Tech Stack

| Kategori | Teknologi |
|---|---|
| UI Library | **React 19** (+ React Compiler via `babel-plugin-react-compiler`) |
| Bahasa | **TypeScript 5** (strict mode, `noUnusedLocals`, `noUnusedParameters`) |
| Build Tool | **Vite 8** (Rolldown) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) |
| Ikon | **lucide-react** |
| Linting | **ESLint 10** + `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |
| Data | Mock data lokal (`src/data/`): truk & ban, pool sasis, API pusat truk, Hino Connect IoT |
| Rencana Backend | PostgreSQL + REST API |

---

## 6. Struktur Proyek

```
src/
├── views/            # Halaman (DigitalTwinView, TireAuditScheduleView, ...)
├── components/
│   ├── common/       # Design system: Badge, Button, Card, Modal, Spinner, StatCard, Table, Toast
│   ├── forms/        # Input: Checkbox, DateInput, FileInput, FormInput, NumberInput, RangeInput,
│   │                 #        SearchInput, Select, TextArea
│   ├── layout/       # Sidebar, Navbar, Container, Grid, PageHeader
│   └── <feature>/    # digitalTwin, auditSchedule, vehicleInspection, truckCoupling, ...
├── hooks/            # Custom hooks per fitur (state & handler)
├── utils/            # Fungsi murni (pure functions)
│   ├── tireManagement/   # tireCalculations (decision matrix), tireOperations, wheelLayout
│   ├── auditSchedule/    # status audit, perpanjangan, penyelesaian audit
│   └── dashboard/        # analisis kesehatan armada
├── constants/        # Aturan bisnis & konfigurasi (tireRules, auditRules, ...)
├── types/            # Tipe TypeScript per domain / view
└── data/             # Mock data
```

**Pola arsitektur:** *View → Hook → Util*. View hanya merakit komponen, hook memegang state & handler, util berisi logika bisnis murni yang mudah diuji.

**Alias path:** `@/` → `src/`.

---

## 7. Menjalankan Proyek

**Prasyarat:** Node.js 20.19+ dan npm.

```bash
npm install       # instal dependensi
npm run dev       # dev server → http://localhost:5174
npm run build     # type-check (tsc -b) + build produksi ke dist/
npm run lint      # ESLint
npm run preview   # preview hasil build
```

---

## 8. Konvensi Kode

1. **Build wajib bersih** — `npm run build` harus 0 error & 0 warning sebelum lanjut.
2. **Selalu pakai kurung kurawal** `{ }` pada setiap `if`.
3. **Gunakan design system** (`@/components/common`, `@/components/forms`) — hindari HTML mentah dengan kelas Tailwind berulang.
4. **Modular** — pecah komponen & kalkulasi besar menjadi fungsi kecil, murni, satu tanggung jawab.
5. **Tipe ketat** — tanpa `any`. Tipe domain ban terpusat di `@/types/TireManagement/tires`.
6. **Tanggal** — format `YYYY-MM-DD` zona waktu lokal via `formatDateOnly` (jangan `toISOString()` yang memakai UTC).

Konteks untuk AI assistant (Claude / Gemini) ada di [`AGENTS.md`](./AGENTS.md).

---

## 9. Roadmap

| Fase | Cakupan | Status |
|---|---|---|
| 1 | Konstanta aturan ban, profil merk, adapter IoT mock | ✅ Selesai |
| 2 | Form inspeksi digital surveyor & penjadwalan audit | ✅ Selesai |
| 3 | Engine deteksi kesehatan, pengaruh merk, mutasi ban | ✅ Selesai |
| 4 | Dashboard ban, analitik CPK, fitur override mekanik | ✅ Selesai |
| 5 | Backend PostgreSQL, REST API, Hino Connect live | ⏳ Berikutnya |

**Visi jangka panjang (6 pilar):** Scheduling, Inspeksi, Tire Management, Inventory Sparepart, Purchasing, dan Maintenance / Work Order — termasuk tiket servis otomatis dari temuan inspeksi dan dukungan multi-kendaraan (Gran Max, box, tronton).

**Catatan teknis terbuka:**
- Bundle JS > 500 kB → rencana *lazy-load* per halaman (`React.lazy`).
- Label siklus audit di tabel masih hardcode.

---

## 10. Dokumen Terkait

Berada satu folder di atas repo ini:

- `blueprint_dan_timeline_pengembangan_fms.md` — Master blueprint & spesifikasi final (MOM 4 & 5 Nov 2026)
- `tire_maintenance_master_roadmap.md` — Roadmap teknis modul ban (golden rules, edge cases, integrasi IoT)
- `fleet-maintenance-system-flow.md` — Arsitektur & alur kerja end-to-end 6 pilar
- `Dokumentasi_AMS.docx` — Dokumentasi aplikasi versi Word

---

© 2026 PT Arta Teknologi (Artenu) untuk PT Armada Lintas Nusantara.
