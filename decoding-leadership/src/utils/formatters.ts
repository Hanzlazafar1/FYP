import { format, parseISO } from "date-fns";

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy · h:mm a");
  } catch {
    return iso;
  }
}

export function sentimentColor(label: string): string {
  switch (label) {
    case "Positive":
      return "#22c55e";
    case "Negative":
      return "#ef4444";
    default:
      return "#f59e0b";
  }
}

export function sentimentBg(label: string): string {
  switch (label) {
    case "Positive":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Negative":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  }
}

export function clampText(text: string, maxChars = 300): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "…";
}

export function wordFrequency(text: string): { word: string; count: number }[] {
  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with",
    "by","from","is","are","was","were","be","been","being","have","has",
    "had","do","does","did","will","would","could","should","may","might",
    "this","that","these","those","it","its","we","our","they","their",
    "i","my","you","your","he","his","she","her","not","no","as","if",
    "so","than","then","when","where","who","which","what","how","all",
    "also","just","more","very","can","us","there","about","up","out",
  ]);

  const freq: Record<string, number> = {};
  text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .forEach((w) => {
      if (w.length > 3 && !stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    });

  return Object.entries(freq)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 60);
}
