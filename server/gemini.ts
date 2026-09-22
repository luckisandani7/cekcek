import { GoogleGenAI, Type } from "@google/genai";
import { AdobeStockMetadata, ADOBE_STOCK_CATEGORIES } from "../src/types";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

interface GenerateSingleVectorResult {
  svgCode: string;
  metadata: AdobeStockMetadata;
}

/**
 * Clean SVG text to extract valid XML
 */
function extractSvgXml(rawText: string): string {
  if (!rawText) return "";
  let clean = rawText.trim();
  // Strip markdown code fences if present
  if (clean.includes("```xml")) {
    clean = clean.replace(/^```xml\s*/i, "").replace(/\s*```$/, "");
  } else if (clean.includes("```svg")) {
    clean = clean.replace(/^```svg\s*/i, "").replace(/\s*```$/, "");
  } else if (clean.includes("```")) {
    clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  // Find <svg ... </svg>
  const svgStart = clean.indexOf("<svg");
  const svgEnd = clean.lastIndexOf("</svg>");
  if (svgStart !== -1 && svgEnd !== -1) {
    clean = clean.substring(svgStart, svgEnd + 6);
  }

  // Ensure standard SVG headers and attributes
  if (!clean.includes('xmlns="http://www.w3.org/2000/svg"')) {
    clean = clean.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!clean.includes("viewBox")) {
    clean = clean.replace("<svg", '<svg viewBox="0 0 800 800" width="800" height="800"');
  }

  return clean;
}

/**
 * Fallback SVG generator if API key is absent or quota exceeded
 */
function createFallbackSvg(
  prompt: string,
  styleId: string,
  paletteId: string,
  index: number
): { svgCode: string; metadata: AdobeStockMetadata } {
  const colors: Record<string, string[]> = {
    "vibrant-modern": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
    "corporate-blue": ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#0F172A"],
    "pastel-scandi": ["#FDE68A", "#A7F3D0", "#BAE6FD", "#DDD6FE", "#FECDD3", "#F3F4F6"],
    "earthy-organic": ["#78350F", "#B45309", "#065F46", "#047857", "#10B981", "#FEF3C7"],
    "monochrome-accent": ["#18181B", "#27272A", "#3F3F46", "#71717A", "#E4E4E7", "#EF4444"]
  };

  const selectedPalette = colors[paletteId] || colors["vibrant-modern"];
  const c1 = selectedPalette[0];
  const c2 = selectedPalette[1];
  const c3 = selectedPalette[2];
  const c4 = selectedPalette[3];
  const c5 = selectedPalette[4] || "#334155";

  // Slugify prompt for filename
  const cleanSlug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30) || "vector_asset";
  const filename = `${cleanSlug}_${String(index + 1).padStart(2, "0")}`;

  const p = prompt.toLowerCase();
  let svgCode = "";

  if (p.includes("kucing") || p.includes("cat") || p.includes("pet") || p.includes("animal")) {
    svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>
    <linearGradient id="head_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bg_${index})"/>
  <circle cx="400" cy="400" r="280" fill="${c3}" opacity="0.12"/>
  <polygon points="280,250 350,150 370,270" fill="${c1}"/>
  <polygon points="300,240 350,175 360,255" fill="${c4}"/>
  <polygon points="520,250 450,150 430,270" fill="${c1}"/>
  <polygon points="500,240 450,175 440,255" fill="${c4}"/>
  <circle cx="400" cy="380" r="150" fill="url(#head_${index})"/>
  <ellipse cx="320" cy="420" rx="20" ry="12" fill="${c4}" opacity="0.6"/>
  <ellipse cx="480" cy="420" rx="20" ry="12" fill="${c4}" opacity="0.6"/>
  <ellipse cx="350" cy="360" rx="14" ry="20" fill="#FFFFFF"/>
  <circle cx="352" cy="360" r="9" fill="#0F172A"/>
  <circle cx="355" cy="356" r="3" fill="#FFFFFF"/>
  <ellipse cx="450" cy="360" rx="14" ry="20" fill="#FFFFFF"/>
  <circle cx="448" cy="360" r="9" fill="#0F172A"/>
  <circle cx="451" cy="356" r="3" fill="#FFFFFF"/>
  <polygon points="400,395 388,382 412,382" fill="#FFFFFF"/>
  <path d="M 400 395 L 400 415 M 400 415 C 385 430, 360 415, 360 405 M 400 415 C 415 430, 440 415, 440 405" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  <line x1="280" y1="390" x2="350" y2="398" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="270" y1="415" x2="345" y2="415" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="520" y1="390" x2="450" y2="398" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="530" y1="415" x2="455" y2="415" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <path d="M 330 520 C 330 480, 470 480, 470 520 L 510 650 C 510 680, 290 680, 290 650 Z" fill="${c5}"/>
  <circle cx="400" cy="540" r="16" fill="${c3}"/>
</svg>`;
  } else if (p.includes("kopi") || p.includes("coffee") || p.includes("tea") || p.includes("cangkir")) {
    svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
    <linearGradient id="cup_${index}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bg_${index})"/>
  <circle cx="400" cy="400" r="280" fill="${c3}" opacity="0.15"/>
  <ellipse cx="400" cy="570" rx="200" ry="32" fill="#000000" opacity="0.08"/>
  <ellipse cx="400" cy="560" rx="180" ry="24" fill="#FFFFFF"/>
  <ellipse cx="400" cy="560" rx="160" ry="18" fill="${c3}" opacity="0.4"/>
  <path d="M 280 340 L 300 520 C 300 550, 500 550, 500 520 L 520 340 Z" fill="url(#cup_${index})"/>
  <path d="M 505 370 C 575 370, 575 480, 495 490" fill="none" stroke="${c2}" stroke-width="26" stroke-linecap="round"/>
  <ellipse cx="400" cy="345" rx="120" ry="24" fill="#451A03"/>
  <ellipse cx="400" cy="345" rx="95" ry="16" fill="${c4}"/>
  <path d="M 360 280 Q 330 220, 360 170" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
  <path d="M 400 260 Q 430 210, 400 150" fill="none" stroke="${c2}" stroke-width="12" stroke-linecap="round" opacity="0.7"/>
  <path d="M 440 280 Q 470 230, 440 180" fill="none" stroke="${c1}" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
</svg>`;
  } else if (p.includes("roket") || p.includes("rocket") || p.includes("startup") || p.includes("launch")) {
    svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="body_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="flame_${index}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bg_${index})"/>
  <circle cx="200" cy="180" r="3" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="620" cy="240" r="4" fill="#FFFFFF" opacity="0.7"/>
  <circle cx="280" cy="600" r="3" fill="#FFFFFF" opacity="0.6"/>
  <circle cx="650" cy="550" r="2" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="400" cy="400" r="260" fill="${c1}" opacity="0.15"/>
  <path d="M 370 540 Q 400 680, 400 700 Q 400 680, 430 540 Z" fill="url(#flame_${index})"/>
  <path d="M 385 540 Q 400 630, 400 650 Q 400 630, 415 540 Z" fill="#FEF08A"/>
  <path d="M 350 450 L 290 530 L 350 520 Z" fill="${c4}"/>
  <path d="M 450 450 L 510 530 L 450 520 Z" fill="${c4}"/>
  <path d="M 400 180 C 470 300, 460 520, 440 540 L 360 540 C 340 520, 330 300, 400 180 Z" fill="url(#body_${index})"/>
  <path d="M 400 180 C 430 230, 435 270, 400 270 C 365 270, 370 230, 400 180 Z" fill="${c4}"/>
  <circle cx="400" cy="350" r="36" fill="${c1}"/>
  <circle cx="400" cy="350" r="26" fill="#38BDF8"/>
  <circle cx="408" cy="342" r="8" fill="#FFFFFF" opacity="0.8"/>
</svg>`;
  } else if (p.includes("tanaman") || p.includes("plant") || p.includes("monstera") || p.includes("daun") || p.includes("bunga")) {
    svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4"/>
      <stop offset="100%" stop-color="#DCFCE7"/>
    </linearGradient>
    <linearGradient id="leaf_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bg_${index})"/>
  <circle cx="400" cy="400" r="260" fill="#BBF7D0" opacity="0.4"/>
  <path d="M 330 520 L 470 520 L 450 670 C 450 690, 350 690, 350 670 Z" fill="#EA580C"/>
  <ellipse cx="400" cy="520" rx="70" ry="16" fill="#C2410C"/>
  <ellipse cx="400" cy="520" rx="60" ry="12" fill="#78350F"/>
  <path d="M 400 520 Q 380 380, 400 240" fill="none" stroke="#065F46" stroke-width="12" stroke-linecap="round"/>
  <path d="M 400 360 C 310 320, 260 220, 380 180 C 420 250, 420 320, 400 360 Z" fill="url(#leaf_${index})"/>
  <path d="M 400 320 C 490 280, 540 180, 420 140 C 380 210, 380 280, 400 320 Z" fill="#059669"/>
  <path d="M 390 440 C 300 420, 240 330, 340 300 C 380 360, 385 410, 390 440 Z" fill="#10B981"/>
  <path d="M 405 420 C 500 400, 560 310, 460 280 C 420 340, 415 390, 405 420 Z" fill="#34D399"/>
</svg>`;
  } else {
    // Build aesthetic modern geometric SVG vector graphic
    const variationSeed = (index * 45) % 360;
    svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="grad_bg_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="grad_primary_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="shadow_${index}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="800" height="800" rx="24" fill="url(#grad_bg_${index})"/>
  <circle cx="400" cy="400" r="310" fill="none" stroke="${c3}" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <circle cx="400" cy="400" r="260" fill="${c1}" opacity="0.06"/>

  <g filter="url(#shadow_${index})" transform="rotate(${variationSeed % 15 - 7} 400 400)">
    <rect x="220" y="220" width="360" height="360" rx="36" fill="${c5}" fill-opacity="0.95"/>
    <rect x="240" y="240" width="320" height="320" rx="28" fill="url(#grad_primary_${index})"/>

    <path d="M 400 280 L 490 440 L 310 440 Z" fill="#FFFFFF" fill-opacity="0.95"/>
    <circle cx="400" cy="380" r="50" fill="${c3}"/>
    <circle cx="400" cy="380" r="28" fill="${c4}"/>

    <circle cx="300" cy="310" r="24" fill="${c2}" fill-opacity="0.85"/>
    <circle cx="500" cy="480" r="18" fill="${c1}" fill-opacity="0.85"/>
    <rect x="280" y="470" width="48" height="48" rx="12" fill="${c3}" fill-opacity="0.9"/>
    <rect x="470" y="290" width="40" height="40" rx="10" fill="${c4}" fill-opacity="0.85"/>
  </g>

  <path d="M 180 620 C 300 580, 500 660, 620 620" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
  <circle cx="620" cy="620" r="8" fill="${c2}"/>
  <circle cx="180" cy="620" r="8" fill="${c1}"/>
</svg>`;
  }

  // Smart Adobe Stock Keywords & Title
  const promptWords = prompt.toLowerCase().split(/\s+/).filter(Boolean);
  const keywordsSet = new Set<string>([
    ...promptWords,
    "vector",
    "design",
    "graphic",
    "modern",
    "symbol",
    "clean",
    "geometric",
    "creative",
    "concept",
    "digital",
    "element",
    "flat",
    "commercial",
    "asset",
    "contemporary",
    "abstract",
    "shape",
    "trendy",
    "minimalist",
    "colorful",
    "professional",
    "branding",
    "logo",
    "artwork",
    "corporate",
    "web",
    "interface"
  ]);

  const category = ADOBE_STOCK_CATEGORIES.find((c) => c.id === 8) || ADOBE_STOCK_CATEGORIES[7]; // Graphic Resources

  const metadata: AdobeStockMetadata = {
    filename,
    title: `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Modern Graphic Concept Design`,
    keywords: Array.from(keywordsSet).slice(0, 35),
    category: 8,
    categoryName: "Graphic Resources"
  };

  return { svgCode, metadata };
}

/**
 * Generate a single vector asset and its Adobe Stock metadata with Gemini
 */
export async function generateSingleVectorWithGemini(
  prompt: string,
  styleId: string,
  paletteId: string,
  index: number,
  totalCount: number
): Promise<GenerateSingleVectorResult> {
  const ai = getAiClient();
  if (!ai) {
    return createFallbackSvg(prompt, styleId, paletteId, index);
  }

  const promptSlug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);
  const filename = `${promptSlug || "vector_stock"}_${String(index + 1).padStart(2, "0")}`;

  try {
    // Generate both Adobe Stock metadata and complete SVG in a single rapid call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert Adobe Stock vector contributor and professional illustrator.
Create a complete, aesthetic SVG vector illustration and strict Adobe Stock metadata for the subject: "${prompt}".
Variation: ${index + 1} of ${totalCount}. Make this variation have a unique artistic angle, layout, or composition.
Vector Style: ${styleId}
Color Palette: ${paletteId}

SVG Requirements:
1. Root element: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
2. Include aesthetic background/canvas, well-drawn layered shapes, paths, geometric details, gradients, and distinct focal representation of "${prompt}".
3. Stock standards: clean paths, balanced contrast, modern flat/isometric style according to the requested style.

Metadata Requirements:
1. Title: 5 to 10 commercial English words. Do NOT include words "vector", "illustration", "isolated", "eps", "svg". (e.g., "Fresh Warm Espresso Coffee Cup on Saucer")
2. Keywords: Array of 30 to 45 ranked commercial keywords (first 10 most relevant).
3. CategoryId: Single best Adobe Stock category number (1 to 21). 1: Animals, 2: Buildings, 3: Business, 4: Drinks, 5: Environment, 6: States of Mind, 7: Food, 8: Graphic Resources, 9: Hobbies, 10: Industry, 11: Landscape, 12: Lifestyle, 13: People, 14: Plants/Flowers, 15: Culture, 16: Science, 17: Social, 18: Sports, 19: Technology, 20: Transport, 21: Travel.
4. CategoryName: Name of the category.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            categoryId: { type: Type.INTEGER },
            categoryName: { type: Type.STRING },
            svgCode: { type: Type.STRING }
          },
          required: ["title", "keywords", "categoryId", "categoryName", "svgCode"]
        }
      }
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.text || "{}");
    } catch {
      parsed = {};
    }

    const metadata: AdobeStockMetadata = {
      filename,
      title: parsed.title || `${prompt} Graphic Concept`,
      keywords: Array.isArray(parsed.keywords) && parsed.keywords.length > 5
        ? parsed.keywords
        : ["concept", "design", "graphic", "commercial", "modern", "symbol", "digital", "element"],
      category: typeof parsed.categoryId === "number" && parsed.categoryId >= 1 && parsed.categoryId <= 21
        ? parsed.categoryId
        : 8,
      categoryName: parsed.categoryName || "Graphic Resources"
    };

    const cleanSvg = extractSvgXml(parsed.svgCode || "");
    if (cleanSvg && cleanSvg.includes("<svg") && cleanSvg.includes("</svg>")) {
      return { svgCode: cleanSvg, metadata };
    }

    // Fallback if SVG was not cleanly returned
    const fallback = createFallbackSvg(prompt, styleId, paletteId, index);
    return { svgCode: fallback.svgCode, metadata };
  } catch (error) {
    console.error("Gemini generation error:", error);
    return createFallbackSvg(prompt, styleId, paletteId, index);
  }
}
