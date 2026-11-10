import type {
  GridCols,
  GridGap,
  GridProps,
} from "@/types/components/layout/layoutTypes";

export default function Grid({
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  gap = "md",
  children,
  className = "",
  ...props
}: GridProps) {
  const colClasses: Record<GridCols, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const smColClasses: Record<GridCols, string> = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
    5: "sm:grid-cols-5",
    6: "sm:grid-cols-6",
    12: "sm:grid-cols-12",
  };

  const mdColClasses: Record<GridCols, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
    12: "md:grid-cols-12",
  };

  const lgColClasses: Record<GridCols, string> = {
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
    5: "lg:grid-cols-5",
    6: "lg:grid-cols-6",
    12: "lg:grid-cols-12",
  };

  const gapClasses: Record<GridGap, string> = {
    none: "gap-0",
    sm: "gap-2.5",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={`grid ${colClasses[cols]} ${smCols ? smColClasses[smCols] : ""} ${
        mdCols ? mdColClasses[mdCols] : ""
      } ${lgCols ? lgColClasses[lgCols] : ""} ${gapClasses[gap]} ${className}`}
      {...props}>
      {children}
    </div>
  );
}
