/**
 * prompt-cleaner.ts
 * ──────────────────
 * Client-side sanitization and normalization utility for Trase user prompts.
 * 
 * Cleans extra spaces, strips non-printable characters, standardizes city aliases,
 * and ensures queries are well-formed before being sent to the streaming backend.
 */

export function cleanPrompt(rawInput: string): string {
  if (!rawInput) return "";

  // 1. Normalize unicode characters
  let cleaned = rawInput.normalize("NFKC");

  // 2. Remove invisible control characters (preserve spaces, newlines)
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, "");

  // 3. Normalize multiple whitespace and tabs into single space
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // 4. Normalize excessive newlines (max 2)
  cleaned = cleaned.replace(/\n\s*\n+/g, "\n\n");

  // 5. Trim leading and trailing whitespace
  cleaned = cleaned.trim();

  // 6. Common city name normalization for Tamil Nadu routes
  const cityReplacements: Record<string, string> = {
    "\\bchenai\\b": "Chennai",
    "\\bmadhurai\\b": "Madurai",
    "\\bcoimbator\\b": "Coimbatore",
    "\\bkovai\\b": "Coimbatore",
    "\\btrichy\\b": "Trichy",
    "\\btiruchirappalli\\b": "Trichy",
    "\\btirupur\\b": "Tiruppur",
    "\\btindivanam\\b": "Tindivanam",
    "\\bvillupuram\\b": "Villupuram",
  };

  for (const [pattern, targetCity] of Object.entries(cityReplacements)) {
    const regex = new RegExp(pattern, "gi");
    cleaned = cleaned.replace(regex, targetCity);
  }

  return cleaned;
}
