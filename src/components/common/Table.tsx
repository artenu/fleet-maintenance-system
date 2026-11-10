import type {
  TableCellProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
} from "@/types/components/common/commonTypes";

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <table
        className={`w-full text-left text-xs text-slate-700 ${className}`}
        {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-black uppercase text-slate-500 select-none">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
  ...props
}: TableRowProps) {
  return (
    <tr
      className={`hover:bg-slate-50/80 transition font-medium ${className}`}
      {...props}>
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
  ...props
}: TableHeadProps) {
  return (
    <th className={`py-3 px-3.5 font-black ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  ...props
}: TableCellProps) {
  return (
    <td className={`py-3.5 px-3.5 ${className}`} {...props}>
      {children}
    </td>
  );
}
