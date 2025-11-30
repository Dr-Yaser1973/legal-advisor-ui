
import { hybridSearch } from "@/lib/search";

export async function POST(req: Request) {
  const { q } = await req.json();

  const result = await hybridSearch(q);

  return Response.json(result);
}
