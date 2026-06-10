import { getLeaderboardData } from "../../data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getLeaderboardData();

  return Response.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
