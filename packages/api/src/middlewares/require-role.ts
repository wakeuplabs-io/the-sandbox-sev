import { User, Role } from "@/generated/prisma";
import { MiddlewareHandler } from "hono";

type Variables = {
  user?: User;
};

export function requireRole(roles: Array<Role>): MiddlewareHandler<{ Variables: Variables }> {
  return async (c, next) => {
    const user = c.get("user") as User | undefined;
    if (!user) {
      return c.json({ error: "No user in context" }, 401);
    }
    if (!roles.includes(user.role)) {
      return c.json({ error: "Forbidden: insufficient role" }, 403);
    }
    await next();
  };
}
