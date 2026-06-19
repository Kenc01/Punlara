import { Router, type IRouter, type Request, type Response } from "express";
import { GetCurrentAuthUserResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  return adminEmails.includes(email);
}

router.get("/auth/user", (req: Request, res: Response) => {
  const user = req.isAuthenticated() ? req.user : null;
  res.json(
    GetCurrentAuthUserResponse.parse({
      user: user
        ? { ...user, isAdmin: isAdminEmail(user.email) }
        : null,
    }),
  );
});

router.post("/auth/sync", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { email, firstName, lastName, profileImageUrl } = req.body as {
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  };

  const userData = {
    id: req.user!.id,
    email: email ?? null,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    profileImageUrl: profileImageUrl ?? null,
  };

  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date(),
      },
    })
    .returning();

  req.user = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
  };

  res.json(
    GetCurrentAuthUserResponse.parse({
      user: { ...req.user, isAdmin: isAdminEmail(req.user.email) },
    }),
  );
});

export default router;
