import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { polishRequestSchema, type Mode, type Tone } from "@/lib/schema";
import { buildSystemPrompt } from "@/lib/prompts";
import { rateLimit } from "@/lib/ratelimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later.", retryAfter: limit.retryAfter },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = polishRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }

    const { text, mode, tone } = parsed.data;
    const modelName = process.env.MODEL_FAST ?? "gemini-2.5-flash";
    const qualityModel = process.env.MODEL_QUALITY ?? "gemini-2.5-pro";

    // Choose model per mode (matching PROJECT.md section 5: fast for fix/improve, quality for rewrite)
    const model = genAI.getGenerativeModel({
      model: mode === "rewrite" ? qualityModel : modelName,
      systemInstruction: buildSystemPrompt(mode as Mode, tone as Tone | undefined),
      generationConfig: {
        temperature: mode === "fix" ? 0.1 : mode === "improve" ? 0.4 : 0.7,
      },
    });

    const result = await model.generateContentStream(text);
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const textChunk = chunk.text();
            if (textChunk) {
              controller.enqueue(new TextEncoder().encode(textChunk));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upstream failure" },
      { status: 502 },
    );
  }
}
