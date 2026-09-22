import { GoogleGenAI, Type } from "@google/genai";
import { AdobeStockMetadata, ADOBE_STOCK_CATEGORIES } from "../src/types";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
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

  // Build aesthetic SVG vector graphic
  const variationSeed = (index * 45) % 360;
  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
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

  <!-- Background Base Canvas -->
  <rect width="800" height="800" rx="24" fill="url(#grad_bg_${index})"/>

  <!-- Decorative geometric aura -->
  <circle cx="400" cy="400" r="310" fill="none" stroke="${c3}" stroke-width="2" stroke-dasharray="8 8" opacity="0.4"/>
  <circle cx="400" cy="400" r="260" fill="${c1}" opacity="0.06"/>

  <!-- Main Vector Composition Layer -->
  <g filter="url(#shadow_${index})" transform="rotate(${variationSeed % 15 - 7} 400 400)">
    <!-- Base Plate / Badge -->
    <rect x="220" y="220" width="360" height="360" rx="36" fill="${c5}" fill-opacity="0.95"/>
    <rect x="240" y="240" width="320" height="320" rx="28" fill="url(#grad_primary_${index})"/>

    <!-- Subject Geometric Focal Shape -->
    <path d="M 400 280 L 490 440 L 310 440 Z" fill="#FFFFFF" fill-opacity="0.95"/>
    <circle cx="400" cy="380" r="50" fill="${c3}"/>
    <circle cx="400" cy="380" r="28" fill="${c4}"/>

    <!-- Accent floating dynamic elements -->
    <circle cx="300" cy="310" r="24" fill="${c2}" fill-opacity="0.85"/>
    <circle cx="500" cy="480" r="18" fill="${c1}" fill-opacity="0.85"/>
    <rect x="280" y="470" width="48" height="48" rx="12" fill="${c3}" fill-opacity="0.9"/>
    <rect x="470" y="290" width="40" height="40" rx="10" fill="${c4}" fill-opacity="0.85"/>
  </g>

  <!-- High-end vector flourishes -->
  <path d="M 180 620 C 300 580, 500 660, 620 620" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
  <circle cx="620" cy="620" r="8" fill="${c2}"/>
  <circle cx="180" cy="620" r="8" fill="${c1}"/>
</svg>`;

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
    // 1. Generate Metadata first with JSON Schema
    const metadataResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are an expert Adobe Stock contributor curator and metadata SEO specialist.
Target Subject / Object: "${prompt}"
Variation Number: ${index + 1} of ${totalCount}
Vector Style: ${styleId}
Color Palette: ${paletteId}

Generate strict Adobe Stock Contributor metadata adhering to these rules:
1. Title: 5 to 10 descriptive English words highlighting commercial stock utility. Do NOT use the words "vector", "illustration", "AI", "eps", "svg", or "isolated". Must sound natural and commercial (e.g., "Modern Creative Rocket Launch Concept for Business Startup").
2. Keywords: Exactly 35 to 45 relevant English keywords. The first 10 keywords MUST be the most specific and highest relevance because Adobe Stock's search algorithm prioritizes the first 10 keywords.
3. Category: Choose the single best Category ID (1 to 21) from Adobe Stock official categories:
   1: Animals, 2: Buildings and Architecture, 3: Business, 4: Drinks, 5: The Environment, 6: States of Mind, 7: Food, 8: Graphic Resources, 9: Hobbies and Leisure, 10: Industry, 11: Landscape, 12: Lifestyle, 13: People, 14: Plants and Flowers, 15: Culture and Religion, 16: Science, 17: Social Issues, 18: Sports, 19: Technology, 20: Transport, 21: Travel.
4. CategoryName: The official name corresponding to that Category ID.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Descriptive commercial title 5-10 words" },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "35-45 ranked keywords"
            },
            categoryId: { type: Type.INTEGER, description: "Official category ID 1-21" },
            categoryName: { type: Type.STRING, description: "Official category name" }
          },
          required: ["title", "keywords", "categoryId", "categoryName"]
        }
      }
    });

    let parsedMeta: any = {};
    try {
      parsedMeta = JSON.parse(metadataResponse.text || "{}");
    } catch {
      parsedMeta = {};
    }

    const metadata: AdobeStockMetadata = {
      filename,
      title: parsedMeta.title || `${prompt} Stock Graphic Concept`,
      keywords: Array.isArray(parsedMeta.keywords) && parsedMeta.keywords.length > 5
        ? parsedMeta.keywords
        : ["concept", "modern", "design", "graphic", "business", "symbol", "digital"],
      category: typeof parsedMeta.categoryId === "number" && parsedMeta.categoryId >= 1 && parsedMeta.categoryId <= 21
        ? parsedMeta.categoryId
        : 8,
      categoryName: parsedMeta.categoryName || "Graphic Resources"
    };

    // 2. Generate pure Scalable Vector Graphics (SVG)
    const svgResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are an elite vector artist and Adobe Illustrator master creating premium stock vector assets for Adobe Stock.
Create a complete, pristine, scalable SVG vector artwork for the object: "${prompt}".
Variation: ${index + 1} of ${totalCount}. Make this variation have a unique artistic composition and focal perspective.
Style: ${styleId}
Palette: ${paletteId}

Technical SVG Specifications:
1. Root element: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
2. Visual Quality: Rich, balanced, highly detailed with layered depth. Use groups <g>, clean paths <path d="...">, shapes <rect>, <circle>, <ellipse>, <polygon>, and aesthetic linear or radial gradients <defs><linearGradient>...</defs>.
3. Stock standards: Clean enclosed paths, balanced negative space, high contrast, vibrant harmonious colors matching the palette, perfectly rendered vector silhouette or illustration.
4. DO NOT wrap with explanation or markdown commentary. Return ONLY the valid <svg> ... </svg> code.`
    });

    const rawSvg = svgResponse.text || "";
    const cleanSvg = extractSvgXml(rawSvg);

    if (cleanSvg && cleanSvg.includes("<svg") && cleanSvg.includes("</svg>")) {
      return { svgCode: cleanSvg, metadata };
    }

    // If SVG extraction failed, use fallback with the generated metadata
    const fallback = createFallbackSvg(prompt, styleId, paletteId, index);
    return { svgCode: fallback.svgCode, metadata };
  } catch (error) {
    console.error("Gemini generation error:", error);
    return createFallbackSvg(prompt, styleId, paletteId, index);
  }
}
