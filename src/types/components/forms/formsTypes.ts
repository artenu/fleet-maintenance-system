import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";

// ================= 4. FORM INPUT (TEXT) =================
export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  subLabel?: ReactNode;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  prefixText?: string;
  suffixText?: string;
}

// ================= 5. NUMBER INPUT =================
export interface NumberInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label?: string;
  subLabel?: ReactNode;
  value: number | undefined | null;
  onChange: (value: number) => void;
  prefixText?: string;
  suffixText?: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
  allowDecimals?: boolean;
}

// ================= 6. DATE INPUT =================
export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  subLabel?: ReactNode;
  error?: string;
  helperText?: string;
}

// ================= 7. SEARCH INPUT =================
export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// ================= 8. SEARCHABLE SELECT (COMBOBOX) =================
export interface SearchableOption {
  value: string;
  label: string;
  subLabel?: string;
  badge?: string;
  badgeColor?: string;
}

export interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}

// ================= 13. CHECKBOX =================
export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label?: ReactNode;
  subLabel?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

// ================= 14. SELECT =================
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  subLabel?: ReactNode;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  options?: SelectOption[];
}

// ================= 15. TEXTAREA =================
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  subLabel?: ReactNode;
  error?: string;
  helperText?: string;
}

// ================= 16. RANGE INPUT (SLIDER) =================
export interface RangeInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label?: string;
  subLabel?: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  valueDisplay?: ReactNode;
  error?: string;
  helperText?: string;
}

// ================= 17. FILE INPUT =================
export interface FileInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value"
> {
  label?: string;
  subLabel?: ReactNode;
  buttonText?: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
  capture?: "user" | "environment";
}
