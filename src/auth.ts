import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { headers } from "next/headers";
import { checkRateLimit, recordFailure, resetLimit } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

        // Rate limit kontrolü
        const { allowed } = checkRateLimit(ip);
        if (!allowed) {
          throw new Error("TooManyRequests");
        }

        // Zod ile girdi doğrulama (güvenlik için)
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          recordFailure(ip);
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Kullanıcıyı veritabanında ara
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          recordFailure(ip);
          return null;
        }

        // Şifre eşleşmesini kontrol et (en az 12 tur Bcrypt kullanılmış olmalı)
        const passwordsMatch = bcrypt.compareSync(password, user.password);

        if (!passwordsMatch) {
          recordFailure(ip);
          return null;
        }

        // Giriş başarılı, limitleri sıfırla
        resetLimit(ip);

        // Giriş başarılı, kullanıcı bilgilerini döndür
        return {
          id: user.id,
          email: user.email,
          name: "Yönetici",
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 2 saatlik oturum süresi
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? `__Secure-authjs.session-token` : `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
