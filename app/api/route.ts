export async function GET(request: Request): Promise<Response> {
  return Response.json({
    message: "Hello, world!",
  });
}
