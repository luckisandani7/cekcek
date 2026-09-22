import { GeneratedVectorAsset, AdobeStockMetadata, ADOBE_STOCK_CATEGORIES } from "../types";
import { convertSvgToEps } from "./epsConverter";

interface ClientGenerateOptions {
  objectPrompt: string;
  styleId: string;
  paletteId: string;
  count: number;
}

const PALETTES: Record<string, string[]> = {
  "vibrant-modern": ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"],
  "corporate-blue": ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#0F172A"],
  "pastel-scandi": ["#FDE68A", "#A7F3D0", "#BAE6FD", "#DDD6FE", "#FECDD3", "#F3F4F6"],
  "earthy-organic": ["#78350F", "#B45309", "#065F46", "#047857", "#10B981", "#FEF3C7"],
  "monochrome-accent": ["#18181B", "#27272A", "#3F3F46", "#71717A", "#E4E4E7", "#EF4444"]
};

function detectCategory(prompt: string): { id: number; name: string } {
  const p = prompt.toLowerCase();
  if (p.includes("kopi") || p.includes("coffee") || p.includes("tea") || p.includes("drink") || p.includes("minum") || p.includes("juice") || p.includes("beer")) {
    return { id: 4, name: "Drinks" };
  }
  if (p.includes("roket") || p.includes("rocket") || p.includes("business") || p.includes("bisnis") || p.includes("startup") || p.includes("growth") || p.includes("keuangan") || p.includes("finance") || p.includes("money") || p.includes("uang")) {
    return { id: 3, name: "Business" };
  }
  if (p.includes("kucing") || p.includes("cat") || p.includes("anjing") || p.includes("dog") || p.includes("hewan") || p.includes("animal") || p.includes("bird") || p.includes("burung") || p.includes("ikan") || p.includes("fish")) {
    return { id: 1, name: "Animals" };
  }
  if (p.includes("komputer") || p.includes("laptop") || p.includes("phone") || p.includes("tech") || p.includes("ai") || p.includes("robot") || p.includes("data") || p.includes("code") || p.includes("cloud")) {
    return { id: 19, name: "Technology" };
  }
  if (p.includes("makan") || p.includes("food") || p.includes("burger") || p.includes("pizza") || p.includes("roti") || p.includes("cake") || p.includes("fruit") || p.includes("buah")) {
    return { id: 7, name: "Food" };
  }
  if (p.includes("pohon") || p.includes("tree") || p.includes("daun") || p.includes("bunga") || p.includes("flower") || p.includes("gunung") || p.includes("mountain") || p.includes("nature") || p.includes("alam")) {
    return { id: 12, name: "Plants and Flowers" };
  }
  if (p.includes("mobil") || p.includes("car") || p.includes("pesawat") || p.includes("plane") || p.includes("motor") || p.includes("transport") || p.includes("travel") || p.includes("liburan")) {
    return { id: 20, name: "Transportation" };
  }
  return { id: 8, name: "Graphic Resources" };
}

function generateProceduralSvg(
  prompt: string,
  styleId: string,
  paletteId: string,
  index: number
): string {
  const palette = PALETTES[paletteId] || PALETTES["vibrant-modern"];
  const c1 = palette[0];
  const c2 = palette[1];
  const c3 = palette[2];
  const c4 = palette[3];
  const c5 = palette[4] || "#334155";

  const p = prompt.toLowerCase();
  const seed = (index * 47) % 360;

  // Custom visual compositions depending on theme and style
  if (p.includes("kucing") || p.includes("cat") || p.includes("pet") || p.includes("animal")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
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
  <!-- Cat Ears -->
  <polygon points="280,250 350,150 370,270" fill="${c1}"/>
  <polygon points="300,240 350,175 360,255" fill="${c4}"/>
  <polygon points="520,250 450,150 430,270" fill="${c1}"/>
  <polygon points="500,240 450,175 440,255" fill="${c4}"/>
  <!-- Head -->
  <circle cx="400" cy="380" r="150" fill="url(#head_${index})"/>
  <!-- Cheeks -->
  <ellipse cx="320" cy="420" rx="20" ry="12" fill="${c4}" opacity="0.6"/>
  <ellipse cx="480" cy="420" rx="20" ry="12" fill="${c4}" opacity="0.6"/>
  <!-- Eyes -->
  <ellipse cx="350" cy="360" rx="14" ry="20" fill="#FFFFFF"/>
  <circle cx="352" cy="360" r="9" fill="#0F172A"/>
  <circle cx="355" cy="356" r="3" fill="#FFFFFF"/>
  <ellipse cx="450" cy="360" rx="14" ry="20" fill="#FFFFFF"/>
  <circle cx="448" cy="360" r="9" fill="#0F172A"/>
  <circle cx="451" cy="356" r="3" fill="#FFFFFF"/>
  <!-- Nose & Whiskers -->
  <polygon points="400,395 388,382 412,382" fill="#FFFFFF"/>
  <path d="M 400 395 L 400 415 M 400 415 C 385 430, 360 415, 360 405 M 400 415 C 415 430, 440 415, 440 405" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
  <line x1="280" y1="390" x2="350" y2="398" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="270" y1="415" x2="345" y2="415" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="520" y1="390" x2="450" y2="398" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="530" y1="415" x2="455" y2="415" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
  <!-- Body Collar -->
  <path d="M 330 520 C 330 480, 470 480, 470 520 L 510 650 C 510 680, 290 680, 290 650 Z" fill="${c5}"/>
  <circle cx="400" cy="540" r="16" fill="${c3}"/>
</svg>`;
  }

  if (p.includes("kopi") || p.includes("coffee") || p.includes("tea") || p.includes("cangkir")) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
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
  <!-- Steam -->
  <path d="M 360 280 Q 330 220, 360 170" fill="none" stroke="${c1}" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
  <path d="M 400 260 Q 430 210, 400 150" fill="none" stroke="${c2}" stroke-width="12" stroke-linecap="round" opacity="0.7"/>
  <path d="M 440 280 Q 470 230, 440 180" fill="none" stroke="${c1}" stroke-width="8" stroke-linecap="round" opacity="0.5"/>
</svg>`;
  }

  // Modern Geometric Vector Representation
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="main_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="accent_${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c3}"/>
      <stop offset="100%" stop-color="${c4}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" rx="32" fill="url(#bg_${index})"/>
  <!-- Decorative Ring -->
  <circle cx="400" cy="400" r="280" fill="none" stroke="${c1}" stroke-width="2" stroke-dasharray="10 8" opacity="0.3"/>
  <circle cx="400" cy="400" r="230" fill="${c3}" opacity="0.08"/>
  
  <!-- Central Emblem / Composition -->
  <g transform="rotate(${seed % 20 - 10} 400 400)">
    <!-- Base Plate -->
    <rect x="250" y="250" width="300" height="300" rx="40" fill="url(#main_${index})"/>
    <rect x="270" y="270" width="260" height="260" rx="32" fill="#FFFFFF" opacity="0.15"/>
    
    <!-- Central Shape -->
    <circle cx="400" cy="400" r="80" fill="url(#accent_${index})"/>
    <circle cx="400" cy="400" r="50" fill="#FFFFFF" opacity="0.9"/>
    <path d="M 370 400 L 430 400 M 400 370 L 400 430" stroke="${c1}" stroke-width="12" stroke-linecap="round"/>
    
    <!-- Floating Accents -->
    <circle cx="320" cy="320" r="22" fill="${c3}"/>
    <circle cx="480" cy="480" r="18" fill="${c4}"/>
    <rect x="460" y="300" width="36" height="36" rx="10" fill="${c2}"/>
    <rect x="300" y="460" width="36" height="36" rx="10" fill="${c5}"/>
  </g>

  <!-- Bottom Details -->
  <path d="M 220 620 C 340 590, 460 650, 580 620" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round" opacity="0.5"/>
</svg>`;
}

export function generateVectorsClientSide(options: ClientGenerateOptions): GeneratedVectorAsset[] {
  const { objectPrompt, styleId = "flat-modern", paletteId = "vibrant-modern", count = 3 } = options;
  const safeCount = Math.max(1, Math.min(10, count || 3));
  const cleanPrompt = objectPrompt.trim() || "modern graphic";
  const categoryInfo = detectCategory(cleanPrompt);

  const cleanSlug = cleanPrompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30) || "vector_asset";

  const results: GeneratedVectorAsset[] = [];

  for (let i = 0; i < safeCount; i++) {
    const filename = `${cleanSlug}_${String(i + 1).padStart(2, "0")}`;
    const svgCode = generateProceduralSvg(cleanPrompt, styleId, paletteId, i);

    // Format title strictly 5-10 words commercial
    const words = cleanPrompt.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
    const title = `${words.join(" ")} Concept for Modern Commercial Design`;

    // High-priority 35+ keywords
    const keywords = Array.from(
      new Set([
        ...cleanPrompt.toLowerCase().split(/\s+/).filter(Boolean),
        "design",
        "graphic",
        "symbol",
        "creative",
        "modern",
        "element",
        "minimalist",
        "flat",
        "clean",
        "contemporary",
        "commercial",
        "abstract",
        "colorful",
        "digital",
        "artwork",
        "icon",
        "branding",
        "logo",
        "sign",
        "shape",
        "style",
        "corporate",
        "web",
        "interface",
        "app",
        "banner",
        "template",
        "print",
        "creative",
        "trendy",
        "collection",
        "set",
        "quality",
        "simple"
      ])
    ).slice(0, 40);

    const metadata: AdobeStockMetadata = {
      filename,
      title,
      keywords,
      category: categoryInfo.id,
      categoryName: categoryInfo.name
    };

    const epsCode = convertSvgToEps(svgCode, {
      title,
      keywords,
      width: 800,
      height: 800
    });

    results.push({
      id: `client_vec_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      filename,
      prompt: cleanPrompt,
      style: styleId,
      palette: paletteId,
      svgCode,
      epsCode,
      metadata,
      createdAt: new Date().toISOString(),
      uploadStatus: "idle"
    });
  }

  return results;
}
