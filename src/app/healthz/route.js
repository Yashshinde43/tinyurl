export async function GET() {
  return Response.json(
    {
      ok: true,
      version: "1.0",
      uptime: process.uptime()  // optional but good
    },
    { status: 200 }
  );
}
