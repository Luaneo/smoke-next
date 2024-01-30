import { verifyLaunchParams } from "./auth";

/**
 * Returns a POST route handler
 */
export async function authWrapper(
  successResponse: (headers: Headers) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      const headers = request.headers;
      const verified = verifyLaunchParams(
        Object.fromEntries(headers),
        process.env.SECRET_KEY ?? "defaultkey"
      );
      if (!verified) {
        throw "Not verified";
      }
      return await successResponse(headers);
    } catch (e) {
      console.error(e);
      return Response.json({
        status: "error",
      });
    }
  };
}
