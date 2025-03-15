import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";

// Define the UserReturn type with the correct Prisma selection
type UserReturn = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    isSystemAdmin: true;
    email: true;
    image: true;
    createdAt: true;
  };
}>;

type Session = Awaited<ReturnType<Awaited<typeof getSession>>>;
type ReturnWithUser = ReturnWithoutUser & { user: UserReturn };
type ReturnWithoutUser = { session: Session };

export const getUser = async (UserId: string) => {
  if (!UserId) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      id: UserId,
    },
    select: {
      id: true,
      name: true,
      isSystemAdmin: true,
      email: true,
      image: true,
      createdAt: true,
    }
  });
  if (!user) {
    return null;
  }

  return user;
};

export const cache__getUser = unstable_cache(getUser);


// Define the generic function signature for getting the current user with or without user data
export async function getCurrentUser<T extends boolean = false>(
  includeDb: T,
): Promise<(T extends true ? ReturnWithUser : ReturnWithoutUser) | null> {
  const session = await getSession();
  if (!session) {
    return null; // If no session, return null
  }

  if (!includeDb) {
    return { session } as T extends true ? ReturnWithUser : ReturnWithoutUser;
  }

  // If we need to include user data, fetch it from the database
  const user = await getUser(session.user.id);
  if (!user) {
    return null; // If no user found in the database, return null
  }

  return { session, user } as T extends true
    ? ReturnWithUser
    : ReturnWithoutUser;
}

async function getSession() {
  const session = await auth();
  if (!session?.user.id) {
    return null; // If no userId, return null, meaning no session
  }
  return session; // Return the session as type Session
}

