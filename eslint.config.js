// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict, // 👈 1. Aktifkan STRICT profile dari typescript-eslint
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 🛡️ 2. Aturan Ketat TypeScript (Zero-Any & No Dead Code)
      "@typescript-eslint/no-explicit-any": "error", // Haram pakai 'any', wajib pakai tipe/interface yang jelas
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Variabel/argumen yang sengaja tidak dipakai wajib diawali garis bawah (_)
          varsIgnorePattern: "^_",
        },
      ],

      // 🔍 3. Standard Code Quality & Bug Prevention
      eqeqeq: ["error", "always"], // Wajib pakai === dan !== (dilarang pakai == karena rawan bug coercion)
      "no-console": ["warn", { allow: ["warn", "error"] }], // Peringatan jika ada console.log tertinggal di produksi
      "prefer-const": "error", // Wajib pakai 'const' jika variabel tidak diubah nilainya
      "no-var": "error", // Dilarang keras memakai 'var'
      curly: ["error", "all"], // Wajib pakai kurung kurawal {} pada semua if/else/for
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports", // Membolehkan import { useState, type ReactNode } dalam 1 baris
        },
      ],
      // Aturan ketat lainnya
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      eqeqeq: ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
]);
