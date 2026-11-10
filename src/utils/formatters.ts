/**
 * Helper: Format angka ke format ribuan bertitik (1000000 -> "1.000.000")
 */
export function formatThousand(
  val: number | string | null | undefined,
): string {
  if (val === null || val === undefined || val === "") {return "";}
  const num =
    typeof val === "number" ? val : Number(String(val).replace(/\D/g, ""));
  if (isNaN(num)) {return "";}
  return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Helper: Parse string ribuan bertitik ke number murni ("1.000.000" -> 1000000)
 */
export function parseThousand(val: string): number {
  if (!val) {return 0;}
  // Hapus semua titik pemisah ribuan
  const clean = val.replace(/\./g, "").replace(/,/g, ".");
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}
