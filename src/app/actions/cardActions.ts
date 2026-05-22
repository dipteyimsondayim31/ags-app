"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const cardSchema = z.object({
  question: z.string().min(1, "Soru en az 1 karakter olmalıdır."),
  answer: z.string().min(1, "Cevap en az 1 karakter olmalıdır."),
  categoryId: z.string().min(1, "Lütfen geçerli bir kategori seçin."),
});

// Admin yetki kontrolü yardımcı fonksiyonu
async function checkAdminAuth() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createCard(prevState: any, formData: FormData) {
  try {
    await checkAdminAuth();

    const rawQuestion = formData.get("question") as string;
    const rawAnswer = formData.get("answer") as string;
    const rawCategoryId = formData.get("categoryId") as string;

    const validatedFields = cardSchema.safeParse({
      question: rawQuestion,
      answer: rawAnswer,
      categoryId: rawCategoryId,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors.question?.[0] || 
               validatedFields.error.flatten().fieldErrors.answer?.[0] || 
               validatedFields.error.flatten().fieldErrors.categoryId?.[0] || 
               "Geçersiz veri girdisi.",
      };
    }

    const { question, answer, categoryId } = validatedFields.data;

    await prisma.card.create({
      data: {
        question,
        answer,
        categoryId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error creating card:", err);
    if (err.message === "Unauthorized") {
      return { success: false, error: "Bu işlem için yetkiniz bulunmamaktadır." };
    }
    return { success: false, error: "Bilgi kartı oluşturulurken bir hata oluştu." };
  }
}

export async function updateCard(id: string, prevState: any, formData: FormData) {
  try {
    await checkAdminAuth();

    const rawQuestion = formData.get("question") as string;
    const rawAnswer = formData.get("answer") as string;
    const rawCategoryId = formData.get("categoryId") as string;

    const validatedFields = cardSchema.safeParse({
      question: rawQuestion,
      answer: rawAnswer,
      categoryId: rawCategoryId,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors.question?.[0] || 
               validatedFields.error.flatten().fieldErrors.answer?.[0] || 
               validatedFields.error.flatten().fieldErrors.categoryId?.[0] || 
               "Geçersiz veri girdisi.",
      };
    }

    const { question, answer, categoryId } = validatedFields.data;

    await prisma.card.update({
      where: { id },
      data: {
        question,
        answer,
        categoryId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error updating card:", err);
    if (err.message === "Unauthorized") {
      return { success: false, error: "Bu işlem için yetkiniz bulunmamaktadır." };
    }
    return { success: false, error: "Bilgi kartı güncellenirken bir hata oluştu." };
  }
}

export async function deleteCard(id: string) {
  try {
    await checkAdminAuth();

    await prisma.card.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error deleting card:", err);
    if (err.message === "Unauthorized") {
      return { success: false, error: "Bu işlem için yetkiniz bulunmamaktadır." };
    }
    return { success: false, error: "Bilgi kartı silinirken bir hata oluştu." };
  }
}
