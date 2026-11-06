/**
 * Clipboard helpers with fallbacks.
 */

export async function readClipboard(): Promise<string | null> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return null;
  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}

export async function writeClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
