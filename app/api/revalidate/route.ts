import { revalidatePath, revalidateTag } from "next/cache";
import { LEADERBOARD_CACHE_TAG } from "../../data";

export async function GET(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  const requestSecret = new URL(request.url).searchParams.get("secret");

  if (secret && requestSecret !== secret) {
    return Response.json({ revalidated: false, message: "Invalid secret." }, { status: 401 });
  }

  revalidateTag(LEADERBOARD_CACHE_TAG, { expire: 0 });
  revalidatePath("/");

  return Response.json({ revalidated: true, now: new Date().toISOString() });
}
