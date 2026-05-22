import { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // Main auth.ts file will populate this
  pages: {
    signIn: "/admin/giris",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname === "/admin/giris";

      if (isOnAdmin) {
        if (isOnLogin) {
          if (isLoggedIn) {
            // Already logged in, redirect to admin dashboard
            return Response.redirect(new URL("/admin", nextUrl));
          }
          return true;
        }
        if (isLoggedIn) return true;
        return false; // Redirect to sign-in page
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
