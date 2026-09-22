export interface AdobeStockCategory {
  id: number;
  name: string;
  nameId: string; // Indonesian label
  description: string;
}

export const ADOBE_STOCK_CATEGORIES: AdobeStockCategory[] = [
  { id: 1, name: "Animals", nameId: "Hewan", description: "Hewan peliharaan, satwa liar, serangga" },
  { id: 2, name: "Buildings and Architecture", nameId: "Bangunan & Arsitektur", description: "Rumah, gedung pencakar langit, konstruksi" },
  { id: 3, name: "Business", nameId: "Bisnis & Keuangan", description: "Kantor, keuangan, kerja sama tim, startup" },
  { id: 4, name: "Drinks", nameId: "Minuman", description: "Kopi, teh, jus, koktail" },
  { id: 5, name: "The Environment", nameId: "Lingkungan", description: "Ekologi, energi hijau, alam semesta" },
  { id: 6, name: "States of Mind", nameId: "Kondisi Pikiran & Emosi", description: "Meditasi, emosi, konsep psikologi" },
  { id: 7, name: "Food", nameId: "Makanan & Kuliner", description: "Hidangan, buah-buahan, sayuran, restoran" },
  { id: 8, name: "Graphic Resources", nameId: "Sumber Daya Grafis", description: "Ikon, pola latar belakang, elemen desain, tekstur" },
  { id: 9, name: "Hobbies and Leisure", nameId: "Hobi & Rekreasi", description: "Kerajinan, musik, membaca, bermain game" },
  { id: 10, name: "Industry", nameId: "Industri & Pabrik", description: "Manufaktur, logistik, alat berat" },
  { id: 11, name: "Landscape", nameId: "Pemandangan Alam", description: "Pegunungan, pantai, hutan, langit" },
  { id: 12, name: "Lifestyle", nameId: "Gaya Hidup", description: "Kebugaran, relaksasi, tren kehidupan" },
  { id: 13, name: "People", nameId: "Manusia & Tokoh", description: "Potret, karakter, profesi, interaksi sosial" },
  { id: 14, name: "Plants and Flowers", nameId: "Tumbuhan & Bunga", description: "Pohon, daun, flora, taman" },
  { id: 15, name: "Culture and Religion", nameId: "Budaya & Tradisi", description: "Festival, perayaan, ornamen etnik" },
  { id: 16, name: "Science", nameId: "Sains & Medis", description: "Laboratorium, DNA, kedokteran, fisika" },
  { id: 17, name: "Social Issues", nameId: "Isu Sosial & Komunitas", description: "Komunitas, keberagaman, kampanye" },
  { id: 18, name: "Sports", nameId: "Olahraga", description: "Sepak bola, lari, kebugaran, kompetisi" },
  { id: 19, name: "Technology", nameId: "Teknologi & AI", description: "Komputer, jaringan, robotika, gadget, cyber" },
  { id: 20, name: "Transport", nameId: "Transportasi", description: "Mobil, pesawat, kereta, sepeda, logistik" },
  { id: 21, name: "Travel", nameId: "Perjalanan & Wisata", description: "Pariwisata, koper, landmark dunia, petualangan" }
];

export interface VectorStyleOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  promptEnhancer: string;
}

export const VECTOR_STYLES: VectorStyleOption[] = [
  {
    id: "flat-modern",
    name: "Modern Flat Art",
    badge: "Terlaris Stock",
    description: "Bentuk bersih, warna solid terkurasi, tanpa gradien berlebih",
    promptEnhancer: "clean modern flat vector illustration style, solid balanced colors, sharp clean vector contours, professional stock graphic"
  },
  {
    id: "isometric-3d",
    name: "Isometric 3D Vector",
    badge: "Populer Tech",
    description: "Perspektif isometrik terukur, kedalaman dimensi modern",
    promptEnhancer: "isometric 3D vector illustration, 30 degree angle perspective, volumetric clean geometry, tech stock asset"
  },
  {
    id: "minimalist-monoline",
    name: "Minimalist Monoline",
    badge: "Elegan",
    description: "Garis kontur tunggal berbobot presisi, estetika elegan",
    promptEnhancer: "minimalist monoline vector art, consistent single stroke weight, clean line contour, elegant negative space"
  },
  {
    id: "vintage-badge",
    name: "Vintage Emblem & Badge",
    badge: "Retro Klasik",
    description: "Lencana retro, ornamen ukiran tipografi klasik",
    promptEnhancer: "vintage retro emblem vector design, ornate classic engraving details, heritage badge style, premium craft look"
  },
  {
    id: "cartoon-mascot",
    name: "Cute Mascot / Character",
    badge: "Karakter",
    description: "Karakter kartun ramah, ekspresif, garis tebal dinamis",
    promptEnhancer: "cute friendly cartoon mascot vector, expressive personality, bold smooth outline, vibrant playful colors"
  },
  {
    id: "icon-set",
    name: "Business & UI Icon Set",
    badge: "Serbaguna",
    description: "Set elemen ikon modular terstruktur dengan grid rapi",
    promptEnhancer: "cohesive vector icon set elements, grid aligned symbols, minimalist professional iconography"
  },
  {
    id: "geometric-abstract",
    name: "Geometric Abstract Pattern",
    badge: "Latar Belakang",
    description: "Pola bentuk geometris modular kontemporer",
    promptEnhancer: "abstract geometric vector pattern composition, bauhaus modern shapes, rhythmic color harmony"
  }
];

export interface ColorPaletteOption {
  id: string;
  name: string;
  hexPreview: string[];
  description: string;
}

export const COLOR_PALETTES: ColorPaletteOption[] = [
  {
    id: "vibrant-modern",
    name: "Vibrant Commercial",
    hexPreview: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
    description: "Warna cerah komersial dengan saturasi seimbang"
  },
  {
    id: "corporate-blue",
    name: "Corporate Tech Blue",
    hexPreview: ["#1E3A8A", "#2563EB", "#60A5FA", "#93C5FD", "#0F172A"],
    description: "Dominasi biru profesional untuk bisnis & teknologi"
  },
  {
    id: "pastel-scandi",
    name: "Pastel Minimalist",
    hexPreview: ["#FDE68A", "#A7F3D0", "#BAE6FD", "#DDD6FE", "#FECDD3"],
    description: "Warna lembut santai gaya Scandinavian"
  },
  {
    id: "earthy-organic",
    name: "Earthy Warm Nature",
    hexPreview: ["#78350F", "#B45309", "#065F46", "#047857", "#FEF3C7"],
    description: "Nuansa terakota, hijau daun, dan rempah alami"
  },
  {
    id: "monochrome-accent",
    name: "Monochrome + Accent",
    hexPreview: ["#18181B", "#3F3F46", "#71717A", "#E4E4E7", "#EF4444"],
    description: "Hitam putih tegas dengan sentuhan warna aksen kontras"
  }
];

export interface AdobeStockMetadata {
  filename: string;
  title: string;
  keywords: string[];
  category: number;
  categoryName: string;
}

export interface GeneratedVectorAsset {
  id: string;
  filename: string;
  prompt: string;
  style: string;
  palette: string;
  svgCode: string;
  epsCode: string;
  thumbnailDataUrl?: string;
  metadata: AdobeStockMetadata;
  createdAt: string;
  uploadStatus?: "idle" | "uploading" | "uploaded" | "failed";
  uploadMessage?: string;
}

export interface BatchGenerationRequest {
  objectPrompt: string;
  styleId: string;
  paletteId: string;
  count: number;
}

export interface SftpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}
