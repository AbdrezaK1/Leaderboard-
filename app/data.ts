import { LCEntry } from "./types";
import { buildCsvUrl, parseCsv } from "./utils";

export const LEADERBOARD_CACHE_TAG = "leaderboard";

export const DEMO_DATA: LCEntry[] = [
  { name: "BABEZ", score: 124, rank: 1 },
  { name: "BENAK", score: 98, rank: 2 },
  { name: "BEJAIA", score: 87, rank: 3 },
  { name: "BLIDA", score: 73, rank: 4 },
  { name: "CONSTANTINE", score: 61, rank: 5 },
  { name: "ORAN", score: 55, rank: 6 },
  { name: "TLEMCEN", score: 41, rank: 7 },
];

export interface LeaderboardData {
  entries: LCEntry[];
  error?: string;
  isDemo: boolean;
  lastUpdated: string;
}

export async function getLeaderboardData(): Promise<LeaderboardData> {
  const sheetUrl = (
    process.env.GOOGLE_SHEET_URL ||
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
    ""
  ).trim();

  if (!sheetUrl) {
    return {
      entries: DEMO_DATA,
      error: "Missing GOOGLE_SHEET_URL. Add your public Google Sheet URL to .env.local.",
      isDemo: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const res = await fetch(buildCsvUrl(sheetUrl), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Could not fetch the sheet. Make sure it is publicly shared.");
    }

    return {
      entries: parseCsv(await res.text()),
      isDemo: false,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    return {
      entries: DEMO_DATA,
      error: error instanceof Error ? error.message : "Unknown sheet loading error.",
      isDemo: true,
      lastUpdated: new Date().toISOString(),
    };
  }
}
