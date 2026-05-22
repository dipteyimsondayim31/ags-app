"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(1, "Kategori adı en az 1 karakter olmalıdır.").max(100, "Kategori adı en fazla 100 karakter olabilir."),
  description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir.").optional().or(z.literal("")),
  icon: z.string().max(50, "İkon adı en fazla 50 karakter olabilir.").optional().or(z.literal("")),
});

// Admin yetki kontrolü yardımcı fonksiyonu
async function checkAdminAuth() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createCategory(prevState: unknown, formData: FormData) {
  try {
    await checkAdminAuth();

    const rawName = formData.get("name") as string;
    const rawDescription = formData.get("description") as string;
    const rawIcon = formData.get("icon") as string;

    const validatedFields = categorySchema.safeParse({
      name: rawName,
      description: rawDescription,
      icon: rawIcon,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors.name?.[0] || "Geçersiz veri girdisi.",
      };
    }

    const { name, description, icon } = validatedFields.data;

    await prisma.category.create({
      data: {
        name,
        description: description || null,
        icon: icon || null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err) {
    console.error("Error creating category:", err);
    if (err instanceof Error && err.message === "Unauthorized") {
      return { success: false, error: "Bu işlem için yetkiniz bulunmamaktadır." };
    }
    // Prisma benzersiz alan hatası kontrolü (P2002)
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return { success: false, error: "Bu isimde bir kategori zaten mevcut." };
    }
    return { success: false, error: "Kategori oluşturulurken bir hata oluştu." };
  }
}

export async function updateCategory(id: string, prevState: unknown, formData: FormData) {
  try {
    await checkAdminAuth();

    const rawName = formData.get("name") as string;
    const rawDescription = formData.get("description") as string;
    const rawIcon = formData.get("icon") as string;

    const validatedFields = categorySchema.safeParse({
      name: rawName,
      description: rawDescription,
      icon: rawIcon,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors.name?.[0] || "Geçersiz veri girdisi.",
      };
    }

    const { name, description, icon } = validatedFields.data;

    await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        icon: icon || null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err) {
    console.error("Error updating category:", err);
    if (err instanceof Error && err.message === "Unauthorized") {
      return { success: false, error: "Bu işlem için yetkiniz bulunmamaktadır." };
    }
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return { success: false, error: "Bu isimde bir kategori zaten mevcut." };
    }
    return { success: false, error: "Kategori güncellenirken bir hata oluştu." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await checkAdminAuth();

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, error: null };
  } catch (err) {
    console.error("Error deleting category:", err);
    if (err instanceof Error && err.message === "Unauthorized") {
      return { success: false, error: "Bu işlem için yetkiniz bulunmamaktadır." };
    }
    return { success: false, error: "Kategori silinirken bir hata oluştu." };
  }
}
