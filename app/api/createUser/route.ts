import { authWrapper } from "@/app/lib/authWrapper";
import prisma from "../db";
import { SmokeType, Cigs, Pods, Disposable } from "@prisma/client";

/**
 * @param headers should contain VK launchParams and smoke_type
 */
export const POST = authWrapper(async (headers: Headers) => {
  const smokeType = headers.get("smoke_type");

  let smokeData:
    | {
        cigs: {
          create: Cigs;
        };
      }
    | {
        pods: {
          create: Pods;
        };
      }
    | {
        disposable: {
          create: Disposable;
        };
      };
  switch (smokeType) {
    case SmokeType.CIGS:
      smokeData = {
        cigs: {
          create: {
            packPrice: Number(headers.get("pack_price")),
            cigsPerDay: Number(headers.get("cigs_per_day")),
            userId: Number(headers.get("user_id")),
          },
        },
      };
      break;

    case SmokeType.PODS:
      smokeData = {
        pods: {
          create: {
            juicePrice: Number(headers.get("juice_price")),
            juicePerMonth: Number(headers.get("juice_per_month")),
            vaporizerPrice: Number(headers.get("vaporizer_price")),
            vaporizersPerMonth: Number(headers.get("vaporizers_per_month")),
            userId: Number(headers.get("user_id")),
          },
        },
      };

    case SmokeType.DISPOSABLE:
      smokeData = {
        disposable: {
          create: {
            disposablePrice: Number(headers.get("disposable_price")),
            disposablesPerMonth: Number(headers.get("disposables_per_month")),
            userId: Number(headers.get("user_id")),
          },
        },
      };

    default:
      throw "Invalid SmokeType or SmokeData";
  }

  return Response.json({
    status: "success",
    user: await prisma.user.create({
      data: {
        id: Number(headers.get("vk_user_id")),
        smokeType: smokeType as SmokeType,
        ...smokeData,
      },
    }),
  });
});
