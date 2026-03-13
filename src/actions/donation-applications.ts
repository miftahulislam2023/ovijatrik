"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function createDonationApplication(formData: FormData) {
    const fullName = String(formData.get("fullName") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const address = String(formData.get("address") || "").trim()
    const reason = String(formData.get("reason") || "").trim()
    const amountRequested = String(formData.get("amountRequested") || "").trim()

    if (!fullName || !phone || !reason) {
        return
    }

    await prisma.donationApplication.create({
        data: {
            fullName,
            phone,
            email: email || null,
            address: address || null,
            reason,
            amountRequested: amountRequested ? Number(amountRequested) : null,
        },
    })

    revalidatePath("/apply-for-donation")
}
