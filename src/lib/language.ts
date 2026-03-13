import { cookies } from "next/headers"

type Language = "en" | "bn"

export async function getRequestLanguage(): Promise<Language> {
    const cookieStore = await cookies()
    const value = cookieStore.get("ovijatrik-language")?.value
    return value === "bn" ? "bn" : "en"
}