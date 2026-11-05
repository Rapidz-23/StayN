// Builds a CSV file in the browser and downloads it. `rows` is an array of arrays (header row first).
// A BOM is added so Excel reads the peso sign and accents correctly.
const cell = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function downloadCSV(filename, rows) {
  const text = rows.map((r) => r.map(cell).join(",")).join("\r\n");
  const blob = new Blob(["\ufeff", text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
