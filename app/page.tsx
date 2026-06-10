import { getLeaderboardData } from "./data";
import Leaderboard from "./components/Leaderboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { entries, error, isDemo, lastUpdated } = await getLeaderboardData();

  return <Leaderboard data={entries} error={error} isDemo={isDemo} lastUpdated={lastUpdated} />;
}
