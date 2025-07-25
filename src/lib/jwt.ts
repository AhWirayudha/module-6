import jwt from "jsonwebtoken";

// Bad practice: hardcoded secret key
const JWT_SECRET =
  process.env.JWT_SECRET || "super-secret-key-for-workshop-demo-only";

// Bad practice: no token expiration management
export function generateToken(payload: any) {
  console.time("JWT Token Generation");
  try {
    // Bad practice: using synchronous operations
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "24h", // Bad practice: long expiration for demo
    });
    console.timeEnd("JWT Token Generation");
    return token;
  } catch (error) {
    console.error("JWT generation error:", error);
    console.timeEnd("JWT Token Generation");
    throw error;
  }
}

// Bad practice: no proper error handling
export function verifyToken(token: string) {
  console.time("JWT Token Verification");
  try {
    // Bad practice: using synchronous operations
    const decoded = jwt.verify(token, JWT_SECRET);
    console.timeEnd("JWT Token Verification");
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    console.timeEnd("JWT Token Verification");
    throw error;
  }
}

// Bad practice: middleware without proper error handling
export function authMiddleware(handler: Function) {
  return async (request: Request) => {
    console.time("Auth Middleware Execution");

    try {
      const authHeader = request.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.timeEnd("Auth Middleware Execution");
        return new Response(JSON.stringify({ message: "No token provided" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      // Bad practice: adding user to request object without proper typing
      (request as any).user = decoded;

      console.timeEnd("Auth Middleware Execution");
      return handler(request);
    } catch (error) {
      console.error("Auth middleware error:", error);
      console.timeEnd("Auth Middleware Execution");
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}
