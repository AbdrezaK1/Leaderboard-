import Image from "next/image";
import { LCEntry } from "../types";

const LC_COLORS = [
  "#00A984",
  "#F5B82E",
  "#F05A28",
  "#2166F3",
  "#B24CFF",
  "#E13B75",
  "#00838F",
  "#6A8E22",
  "#2D4F9E",
  "#C46B18",
];

const LC_LOGOS: Record<string, string> = {
  BABEZ: "/lc-logos/lc-babez.jpg",
  BENAK: "/lc-logos/lc-benak.jpg",
  BEJAIA: "/lc-logos/lc-bejaia.jpg",
  BLIDA: "/lc-logos/lc-blida.png",
  CONSTATINE: "/lc-logos/lc-constantine.jpg",
  CONSTANTINE: "/lc-logos/lc-constantine.jpg",
  TLEMCEN: "/lc-logos/lc-tlemcen.jpg",
  ORAN: "/lc-logos/lc-oran.png",
};

interface Props {
  entry: LCEntry;
  index: number;
  maxScore: number;
}

export default function LeaderboardRow({ entry, index, maxScore }: Props) {
  const rank = index + 1;
  const color = LC_COLORS[index % LC_COLORS.length];
  const pct = maxScore > 0 ? Math.max(6, Math.round((entry.score / maxScore) * 100)) : 6;
  const isTopThree = rank <= 3;
  const logoSrc = LC_LOGOS[entry.name];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-white px-2.5 py-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:rounded-2xl sm:px-3 sm:py-3 ${
        rank === 1
          ? "border-[#f5b82e]/70"
          : isTopThree
            ? "border-[#13231f]/15"
            : "border-[#13231f]/10"
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: isTopThree ? color : "#d8d0bf" }}
      />

      <div className="grid grid-cols-[36px_minmax(0,1fr)_64px] items-center gap-2 sm:grid-cols-[42px_minmax(0,1fr)_92px] sm:gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm ${
            rank === 1
              ? "bg-[#f5b82e] text-[#241900]"
              : rank === 2
                ? "bg-[#dce1e4] text-[#263238]"
                : rank === 3
                  ? "bg-[#e89a54] text-[#281203]"
                  : "bg-[#13231f]/8 text-[#13231f]/55"
          }`}
        >
          {rank}
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#13231f]/10 sm:h-10 sm:w-10"
              style={{ background: logoSrc ? "#fff" : color }}
            >
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={`${entry.name} logo`}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-black text-white sm:text-[13px]">
                  {entry.name.slice(3, 5).toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-normal text-[#13231f] sm:text-base">
                {entry.name}
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#eee5d6] sm:mt-2 sm:h-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-black leading-none text-[#13231f] sm:text-2xl">
            {entry.score.toLocaleString()}
          </p>
          <p className="mt-1 text-[8px] font-black uppercase tracking-[0.12em] text-[#13231f]/40 sm:text-[10px] sm:tracking-[0.2em]">
            signups
          </p>
        </div>
      </div>
    </div>
  );
}
