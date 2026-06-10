import { LCEntry } from "./types";

export function buildCsvUrl(raw: string): string {
  if (!raw.trim()) return raw;

  if (raw.includes("docs.google.com/spreadsheets")) {
    const idMatch = raw.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = raw.match(/[#&?]gid=(\d+)/);
    if (idMatch) {
      const id = idMatch[1];
      const gid = gidMatch ? gidMatch[1] : "0";
      return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
    }
  }
  return raw;
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const next = csv[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field.trim());
  rows.push(row);

  return rows.filter((cells) => cells.some((cell) => cell.length > 0));
}

export function parseCsv(csv: string): LCEntry[] {
  const rows = parseCsvRows(csv);

  if (rows.length < 2) throw new Error("Sheet appears empty.");

  const header = rows[0].map((h) => h.trim().toLowerCase());

  const nameCol = header.findIndex((h) =>
    ["lc", "name", "city", "team", "local committee"].some((k) => h.includes(k))
  );
  const scoreCol = header.findIndex((h) =>
    ["sign", "score", "count", "point", "total", "result", "signup"].some((k) =>
      h.includes(k)
    )
  );

  const nc = nameCol === -1 ? 0 : nameCol;
  const sc = scoreCol === -1 ? 1 : scoreCol;

  return rows
    .slice(1)
    .map((r) => ({
      name: (r[nc] || "").trim().toUpperCase(),
      score: Number.parseInt((r[sc] || "0").replace(/[^\d-]/g, ""), 10) || 0,
    }))
    .filter((d) => d.name)
    .sort((a, b) => b.score - a.score)
    .map((d, i) => ({ ...d, rank: i + 1 }));
}
