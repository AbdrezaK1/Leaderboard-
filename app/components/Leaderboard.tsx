"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { LCEntry } from "../types";
import LeaderboardRow from "./LeaderboardRow";

interface Props {
  data: LCEntry[];
  error?: string;
  isDemo?: boolean;
  lastUpdated: string;
}

export default function Leaderboard({ data, error, isDemo = false, lastUpdated }: Props) {
  const [entries, setEntries] = useState(data);
  const [currentError, setCurrentError] = useState(error);
  const [usingDemo, setUsingDemo] = useState(isDemo);
  const [updatedAt, setUpdatedAt] = useState(lastUpdated);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        const res = await fetch(`/api/leaderboard?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Could not refresh leaderboard.");

        const next = (await res.json()) as {
          entries: LCEntry[];
          error?: string;
          isDemo: boolean;
          lastUpdated: string;
        };

        if (!cancelled) {
          setEntries(next.entries);
          setCurrentError(next.error);
          setUsingDemo(next.isDemo);
          setUpdatedAt(next.lastUpdated);
        }
      } catch (refreshError) {
        if (!cancelled) {
          setCurrentError(
            refreshError instanceof Error ? refreshError.message : "Could not refresh leaderboard."
          );
        }
      }
    }

    refresh();
    const interval = window.setInterval(refresh, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const maxScore = entries[0]?.score ?? 1;
  const totalSignups = entries.reduce((sum, entry) => sum + entry.score, 0);
  const leader = entries[0];
  const updated = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(updatedAt)),
    [updatedAt]
  );

  return (
    <main className="min-h-screen bg-[#07120f] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-[#f7f1e4] text-[#13231f] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#081b16] p-6 text-white sm:p-8">
            <div className="absolute inset-x-0 top-0 h-2 bg-[#00a984]" />
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffbf2f]/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#00a984]/20 blur-3xl" />

            <div className="relative flex flex-col gap-5">
              <div className="max-w-sm">
                <p className="text-xs font-black uppercase tracking-[0.38em] text-[#00d69e]">
                  The Signup Cup
                </p>
                <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-normal sm:text-6xl">
                  Live Leaderboard
                </h1>
              </div>
              <div className="flex w-fit rounded-2xl bg-[#f7f1e4] p-4 shadow-[0_22px_50px_rgba(0,0,0,0.28)]">
                <div className="relative h-28 w-48 sm:h-32 sm:w-56">
                  <Image
                    src="/signup-cup-logo.png"
                    alt="Signup Cup trophy logo"
                    fill
                    priority
                    sizes="224px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="relative mt-10 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/50">
                  Total
                </p>
                <p className="mt-1 text-3xl font-black">{totalSignups.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/50">
                  Leader
                </p>
                <p className="mt-1 truncate text-3xl font-black">{leader?.name ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#13231f]/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#00a984]">
                  Ranking
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-normal">
                  Local Committees
                </h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#13231f] px-4 py-2 text-xs font-black text-white">
                <span className="h-2 w-2 rounded-full bg-[#00d69e] shadow-[0_0_16px_#00d69e]" />
                {updated}
              </div>
            </div>

            {currentError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p className="font-black">{usingDemo ? "Using demo ranking" : "Sheet error"}</p>
                <p className="mt-1 opacity-80">{currentError}</p>
              </div>
            )}

            <div className="mb-2 grid grid-cols-[54px_1fr_92px] px-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#13231f]/45">
              <span>Rank</span>
              <span>LC</span>
              <span className="text-right">Signups</span>
            </div>

            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <LeaderboardRow key={entry.name} entry={entry} index={i} maxScore={maxScore} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
