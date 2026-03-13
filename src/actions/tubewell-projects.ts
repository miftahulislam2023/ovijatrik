"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { uploadImage } from "@/lib/cloudinary"

function getFiles(formData: FormData, key: string) {
    return formData
        .getAll(key)
        .filter((item) => item instanceof File && item.size > 0) as File[]
}

export async function createTubewellProject(formData: FormData) {
    const title = String(formData.get("title") || "").trim()
    const location = String(formData.get("location") || "").trim()
    const description = String(formData.get("description") || "").trim()
    const completedAtValue = String(formData.get("completedAt") || "").trim()
    const images = getFiles(formData, "images")

    if (!title || !description) {
        return
    }

    const imageUploads = await Promise.all(
        images.map((file) => uploadImage(file, "ovijatrik/tubewell-projects"))
    )

    await prisma.tubewellProject.create({
        data: {
            title,
            location: location || null,
            description,
            completedAt: completedAtValue ? new Date(completedAtValue) : null,
            imageUrls: imageUploads.map((image) => image.url),
        },
    })

    revalidatePath("/admin/tubewell-projects")
    revalidatePath("/tubewell-project")
}
