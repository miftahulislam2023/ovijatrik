"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"
import { slugify } from "@/lib/slug"

function getFiles(formData: FormData, key: string) {
    return formData
        .getAll(key)
        .filter((item) => item instanceof File && item.size > 0) as File[]
}

export async function createWeeklyProject(formData: FormData) {
    const title = String(formData.get("title") || "").trim()
    const summary = String(formData.get("summary") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const targetAmount = Number(formData.get("targetAmount") || 0)
    const images = getFiles(formData, "images")

    if (!title || !description || !targetAmount) {
        return
    }

    const imageUploads = await Promise.all(
        images.map((file) => uploadImage(file, "ovijatrik/weekly-projects"))
    )

    await prisma.weeklyProject.create({
        data: {
            title,
            slug: slugify(title),
            summary: summary || null,
            description,
            targetAmount,
            imageUrls: imageUploads.map((image) => image.url),
        },
    })

    revalidatePath("/admin/weekly-projects")
    revalidatePath("/weekly-project")
}
