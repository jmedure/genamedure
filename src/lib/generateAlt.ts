import { generateText } from "ai";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "ptkp2bg1";

export function isAllowedSanityImageUrl(imageUrl: string): boolean {
  try {
    const url = new URL(imageUrl);
    if (url.protocol !== "https:") return false;
    if (url.hostname !== "cdn.sanity.io") return false;
    return url.pathname.includes(`/images/${PROJECT_ID}/`);
  } catch {
    return false;
  }
}

export async function generateAltFromImageUrl(
  imageUrl: string,
): Promise<string> {
  const { text } = await generateText({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: [
              "Write alt text for a TikTok gallery thumbnail of creator Gena Medure.",
              "Describe what is visibly happening in one short sentence.",
              "Be specific and neutral. No hashtags, emojis, or quotes.",
              "Do not start with 'Image of' or 'A photo of'.",
              "Max 120 characters. Return only the alt text.",
            ].join(" "),
          },
          {
            type: "file",
            data: new URL(imageUrl),
            mediaType: "image/jpeg",
          },
        ],
      },
    ],
  });

  return text
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 160);
}
