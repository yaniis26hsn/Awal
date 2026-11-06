import { z } from "zod";

export const MAX_INPUT_CHARS = 5000;

export type Mode = "fix" | "improve" | "rewrite";
export type Tone = "neutral" | "formal" | "friendly" | "professional" | "concise";

export const MODES: Mode[] = ["fix", "improve", "rewrite"];
export const TONES: Tone[] = [
  "neutral",
  "formal",
  "friendly",
  "professional",
  "concise",
];

export const polishRequestSchema = z.object({
  text: z.string().min(1, "Text is required").max(MAX_INPUT_CHARS, `Text is too long (max ${MAX_INPUT_CHARS} characters)`),
  mode: z.enum(["fix", "improve", "rewrite"]).default("fix"),
  tone: z.enum(["neutral", "formal", "friendly", "professional", "concise"]).optional(),
});

export type PolishRequest = z.infer<typeof polishRequestSchema>;

export type ModeConfig = {
  model: string;
  temperature: number;
  options: ("tone" | "targetLanguage")[];
  buildSystemPrompt: (opts: { tone?: Tone }) => string;
};
