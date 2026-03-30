export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) return Response.json([]);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      {
        headers: {
          "User-Agent": "travel-planner-app",
        },
      }
    );

    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}