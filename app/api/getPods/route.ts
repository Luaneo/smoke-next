import { verifyLaunchParams } from "@/app/lib/auth";
import prisma from "../db";

export async function POST(request: Request): Promise<Response> {
  try {
    const headers = request.headers;
    const verified = verifyLaunchParams(
      Object.fromEntries(headers),
      process.env.SECRET_KEY ?? "defaultkey"
    );
    if (!verified) {
      throw "Not verified";
    }
    return Response.json({
      status: "success",
      user: await prisma.pods.findFirst({
        where: { userId: Number(headers.get("vk_user_id")) },
      }),
    });
  } catch (e) {
    console.error(e);
    return Response.json({
      status: "error",
    });
  }
}
