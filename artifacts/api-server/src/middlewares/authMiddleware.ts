import { createRemoteJWKSet, jwtVerify } from "jose";
import { type Request, type Response, type NextFunction } from "express";
import type { AuthUser } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User extends AuthUser {}

    interface Request {
      isAuthenticated(): this is AuthedRequest;
      user?: User | undefined;
    }

    export interface AuthedRequest {
      user: User;
    }
  }
}

function getClerkJwksUrl(): string {
  const publishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY || "";
  const b64 = publishableKey.replace(/^pk_(test|live)_/, "");
  const decoded = Buffer.from(b64, "base64").toString("utf-8").replace(/\$$/, "");
  return `https://${decoded}/.well-known/jwks.json`;
}

const JWKS = createRemoteJWKSet(new URL(getClerkJwksUrl()));

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.isAuthenticated = function (this: Request) {
    return this.user != null;
  } as Request["isAuthenticated"];

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["RS256"],
    });

    const clerkUserId = payload.sub as string;
    if (!clerkUserId) {
      next();
      return;
    }

    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, clerkUserId));

    if (dbUser) {
      req.user = {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl,
      };
    } else {
      req.user = {
        id: clerkUserId,
        email: null,
        firstName: null,
        lastName: null,
        profileImageUrl: null,
      };
    }
  } catch {
    // Invalid or expired token — treat as unauthenticated
  }

  next();
}
