"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Custom rate limit ve kimlik doğrulama hata yönetimi
      if (error.cause?.err?.message === "TooManyRequests") {
        return "Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.";
      }
      switch (error.type) {
        case "CredentialsSignin":
          return "E-posta veya şifre hatalı.";
        default:
          return "Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.";
      }
    }
    throw error;
  }
}
