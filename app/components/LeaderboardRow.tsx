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

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white px-3 py-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
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

      <div className="grid grid-cols-[42px_1fr_92px] items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${
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
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
              style={{ backgroundColor: color }}
            >
              {getInitials(entry.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black uppercase tracking-normal text-[#13231f]">
                {entry.name}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eee5d6]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black leading-none text-[#13231f]">
            {entry.score.toLocaleString()}
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#13231f]/40">
            signups
          </p>
        </div>
      </div>
    </div>
  );
}
