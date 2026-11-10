// src/components/layout/Container.tsx
import type { ContainerProps } from "@/types/components/layout/layoutTypes";

export default function Container({
  children,
  maxWidth = "7xl",
  className = "",
  ...props
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}
      {...props}>
      {children}
    </div>
  );
}
