import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ================= GRID-COLS =================
export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = "none" | "sm" | "md" | "lg" | "xl";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  smCols?: GridCols;
  mdCols?: GridCols;
  lgCols?: GridCols;
  gap?: GridGap;
  children: ReactNode;
}

// ================= CONTAINER =================

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  className?: string;
}

// ================= PAGEHEADER =================

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  badgeColor?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  actions?: ReactNode;
  className?: string;
}

export interface NavbarProps {
  title: string;
  subtitle?: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  actions?: ReactNode;
}
