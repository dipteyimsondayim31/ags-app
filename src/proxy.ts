import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const authMiddleware = NextAuth(authConfig).auth;

export const proxy = authMiddleware((req) => {
  const { pathname } = req.nextUrl;

  // API callback rotasında IP bazlı Rate Limiting kontrolü
  if (req.method === "POST" && pathname === "/api/auth/callback/credentials") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/callback/credentials",
  ],
};
