// src/types/common/commonTypes.ts
import type { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

// ================= 1. BUTTON =================
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "outline"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

// ================= 2. BADGE =================
export type BadgeVariant =
  | "neutral"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "purple";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: LucideIcon;
  pulse?: boolean;
  className?: string;
}

// ================= 3. CARD =================
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// ================= 9. STAT CARD (KPI) =================
export type StatCardVariant =
  | "default"
  | "success"
  | "danger"
  | "info"
  | "purple";

export interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  subtitle?: ReactNode;
  icon: LucideIcon;
  variant?: StatCardVariant;
}

// ================= 10. TOAST NOTIFICATION =================

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  description?: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

// Tambahkan di src/types/common/commonTypes.ts (di bawah tipe yang sudah ada)
import type { TdHTMLAttributes, ThHTMLAttributes } from "react";

// ================= 10. MODAL =================
export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
}

// ================= 11. TABLE =================
export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  className?: string;
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  className?: string;
}

// ================= 12. SPINNER =================
export type SpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "primary" | "white" | "slate" | "emerald";

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  text?: string;
  className?: string;
  fullPage?: boolean;
}

// Re-export types from forms directory for backward compatibility
export type * from "../forms/formsTypes";
