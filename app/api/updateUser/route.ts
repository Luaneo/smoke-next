import { authWrapper } from "@/app/lib/authWrapper";
import prisma from "../db";
import { User } from "@prisma/client";

export const POST = authWrapper(async (headers: Headers) => {
  let userData: Partial<Omit<User, "id">> = {};
  const lives = headers.get("lives");
  if (lives) {
    userData.lives = Number(lives);
  }
  const smokedDate = headers.get("smoked_date");
  if (smokedDate) {
    userData.smokedDates = [new Date(smokedDate)];
  }
  // TODO: Add more fields
  const result = await prisma.user.update({
    where: { id: Number(headers.get("vk_user_id")) },
    data: userData,
  });
  return Response.json({
    status: "success",
    result: result,
  });
});
