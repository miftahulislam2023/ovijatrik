import { v2 as cloudinary } from "cloudinary"

let isConfigured = false

function ensureCloudinaryConfigured() {
    if (isConfigured) return

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_ID
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    const missing = [
        ["CLOUDINARY_CLOUD_NAME (or CLOUDINARY_ID)", cloudName],
        ["CLOUDINARY_API_KEY", apiKey],
        ["CLOUDINARY_API_SECRET", apiSecret],
    ]
        .filter(([, value]) => !value)
        .map(([name]) => name)

    if (missing.length > 0) {
        throw new Error(`Cloudinary is not configured. Missing env: ${missing.join(", ")}`)
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    })

    isConfigured = true
}

export async function uploadImage(file: File, folder: string) {
    ensureCloudinaryConfigured()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const dataUri = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: "image",
    })

    return {
        url: result.secure_url,
        publicId: result.public_id,
    }
}
