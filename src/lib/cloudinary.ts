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

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, uploadResult) => {
                if (error || !uploadResult) {
                    reject(error ?? new Error("Cloudinary upload failed"))
                    return
                }
                resolve(uploadResult)
            },
        )

        stream.end(buffer)
    })

    return {
        url: result.secure_url,
        publicId: result.public_id,
    }
}
