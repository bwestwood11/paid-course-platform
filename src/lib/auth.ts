import { db } from "@/server/db";
import { unstable_cache } from "next/cache";

export const getUser = async (UserId: string) => {
  if (!UserId) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      id: UserId,
    },
  });
  if (!user) {
    return null;
  }

  return user;
};

export const cache__getUser = unstable_cache(getUser);
