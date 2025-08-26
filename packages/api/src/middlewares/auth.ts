import { User } from "@/generated/prisma";
import { validateSocialLogin } from "@/lib/auth";
import { MiddlewareHandler } from "hono";
import * as jose from "jose";
import { getUserByEmail } from "../domain/users/users.service";

// Extend the context type to include user
type Variables = {
  user?: User;
};

// Helper function to get userAddress from context
export const getUserAddress = (c: any): string | undefined => {
  const user = c.get("user");
  return user?.address;
};

// Helper function to get user from context
export const getCurrentUser = (c: any): User | undefined => {
  return c.get("user");
};

export const authMiddleware: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  let idToken = c.req.header("Authorization") || "";
  if (idToken.startsWith("Bearer ")) {
    idToken = idToken.slice(7);
  }
  const { isValid, error } = await validateSocialLogin(idToken);
  if (!isValid) {
    return c.json({ error }, 401);
  }

  // Extraer email del token y guardar el usuario en el contexto
  try {
    const jwks = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks"));
    const { payload } = await jose.jwtVerify(idToken, jwks, {
      algorithms: ["ES256"],
    });
    const { email } = payload as { email: string };
    if (email) {
      const user = await getUserByEmail(email);
      if (user) c.set("user", user);
    }
  } catch (e) {
    console.error("Auth middleware - error extracting user:", e);
    // Si falla, igual sigue autenticado pero sin user extra
  }
  await next();
};
