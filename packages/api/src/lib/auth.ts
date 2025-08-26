import * as jose from "jose";

export async function validateSocialLogin(idToken: string) {
  try {
    if (!idToken) return { isValid: false, error: "No token provided" };
    // Verify JWT using Web3Auth JWKS
    const jwks = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks"));
    const { payload } = await jose.jwtVerify(idToken, jwks, {
      algorithms: ["ES256"],
    });

    return { isValid: true, payload, error: null };
  } catch (error) {
    console.error("Social login verification error:", error);
    return { isValid: false, error: "Verification error" };
  }
}
