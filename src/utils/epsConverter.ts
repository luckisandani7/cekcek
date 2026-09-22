/**
 * Converts Scalable Vector Graphics (SVG) into Adobe Stock compliant
 * Encapsulated PostScript (EPS-10 / Level 2 PostScript) format.
 */

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

function parseHexOrRgbColor(colorStr: string): ColorRGB | null {
  if (!colorStr || colorStr === "none" || colorStr === "transparent") {
    return null;
  }
  const clean = colorStr.trim().toLowerCase();

  // Hex format #RRGGBB or #RGB
  if (clean.startsWith("#")) {
    let hex = clean.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return {
        r: Number.isNaN(r) ? 0 : Math.max(0, Math.min(1, r)),
        g: Number.isNaN(g) ? 0 : Math.max(0, Math.min(1, g)),
        b: Number.isNaN(b) ? 0 : Math.max(0, Math.min(1, b))
      };
    }
  }

  // rgb(r, g, b) format
  const rgbMatch = clean.match(/rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/);
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]) / 255;
    const g = parseFloat(rgbMatch[2]) / 255;
    const b = parseFloat(rgbMatch[3]) / 255;
    return {
      r: Number.isNaN(r) ? 0 : Math.max(0, Math.min(1, r)),
      g: Number.isNaN(g) ? 0 : Math.max(0, Math.min(1, g)),
      b: Number.isNaN(b) ? 0 : Math.max(0, Math.min(1, b))
    };
  }

  // Named colors
  const namedColors: Record<string, [number, number, number]> = {
    black: [0, 0, 0],
    white: [1, 1, 1],
    red: [1, 0, 0],
    green: [0, 0.5, 0],
    blue: [0, 0, 1],
    yellow: [1, 1, 0],
    cyan: [0, 1, 1],
    magenta: [1, 0, 1],
    gray: [0.5, 0.5, 0.5],
    grey: [0.5, 0.5, 0.5],
    orange: [1, 0.647, 0],
    purple: [0.5, 0, 0.5]
  };

  if (namedColors[clean]) {
    const [r, g, b] = namedColors[clean];
    return { r, g, b };
  }

  return { r: 0.2, g: 0.2, b: 0.2 };
}

export function convertSvgToEps(
  svgString: string,
  options: {
    title?: string;
    keywords?: string[];
    width?: number;
    height?: number;
  } = {}
): string {
  const width = options.width || 800;
  const height = options.height || 800;
  const title = options.title || "Vector Artwork";
  const keywords = (options.keywords || []).slice(0, 40).join(", ");
  const dateStr = new Date().toISOString();

  // EPS Header - Level 2 / EPS-10 standard compliant
  let eps = `%!PS-Adobe-3.0 EPSF-3.0
%%Creator: VectorStock AI Adobe Stock Generator
%%Title: ${title.replace(/[()\\]/g, "")}
%%CreationDate: ${dateStr}
%%BoundingBox: 0 0 ${width} ${height}
%%HiResBoundingBox: 0.000 0.000 ${width}.000 ${height}.000
%%DocumentData: Clean7Bit
%%LanguageLevel: 2
%%Pages: 1
%%Keywords: ${keywords.replace(/[()\\]/g, "")}
%%EndComments

%%BeginProlog
/m {moveto} bind def
/l {lineto} bind def
/c {curveto} bind def
/cp {closepath} bind def
/f {fill} bind def
/s {stroke} bind def
/rgb {setrgbcolor} bind def
/lw {setlinewidth} bind def
/gs {gsave} bind def
/gr {grestore} bind def
%%EndProlog

%%Page: 1 1
gs
% Invert coordinate space from SVG (0,0 top-left) to PostScript (0,0 bottom-left)
0 ${height} translate
1 -1 scale

`;

  // Parse basic SVG elements using regex
  // 1. Rectangles <rect ... />
  const rectRegex = /<rect([^>]+)\/?>/gi;
  let match;
  while ((match = rectRegex.exec(svgString)) !== null) {
    const attrs = match[1];
    const x = parseFloat(attrs.match(/\bx=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const y = parseFloat(attrs.match(/\by=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const w = parseFloat(attrs.match(/\bwidth=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const h = parseFloat(attrs.match(/\bheight=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const fillStr = attrs.match(/\bfill=["']?([^"'\s>]+)["']?/)?.[1] || "#000000";
    const strokeStr = attrs.match(/\bstroke=["']?([^"'\s>]+)["']?/)?.[1];
    const strokeWidth = parseFloat(attrs.match(/\bstroke-width=["']?([0-9.-]+)["']?/)?.[1] || "1");

    if (w > 0 && h > 0) {
      const fillColor = parseHexOrRgbColor(fillStr);
      if (fillColor) {
        eps += `gs ${fillColor.r.toFixed(3)} ${fillColor.g.toFixed(3)} ${fillColor.b.toFixed(3)} rgb\n`;
        eps += `newpath ${x.toFixed(2)} ${y.toFixed(2)} m ${(x + w).toFixed(2)} ${y.toFixed(2)} l ${(x + w).toFixed(2)} ${(y + h).toFixed(2)} l ${x.toFixed(2)} ${(y + h).toFixed(2)} l cp f gr\n`;
      }
      if (strokeStr && strokeStr !== "none") {
        const strokeColor = parseHexOrRgbColor(strokeStr);
        if (strokeColor) {
          eps += `gs ${strokeWidth} lw ${strokeColor.r.toFixed(3)} ${strokeColor.g.toFixed(3)} ${strokeColor.b.toFixed(3)} rgb\n`;
          eps += `newpath ${x.toFixed(2)} ${y.toFixed(2)} m ${(x + w).toFixed(2)} ${y.toFixed(2)} l ${(x + w).toFixed(2)} ${(y + h).toFixed(2)} l ${x.toFixed(2)} ${(y + h).toFixed(2)} l cp s gr\n`;
        }
      }
    }
  }

  // 2. Circles <circle ... />
  const circleRegex = /<circle([^>]+)\/?>/gi;
  while ((match = circleRegex.exec(svgString)) !== null) {
    const attrs = match[1];
    const cx = parseFloat(attrs.match(/\bcx=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const cy = parseFloat(attrs.match(/\bcy=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const r = parseFloat(attrs.match(/\br=["']?([0-9.-]+)["']?/)?.[1] || "0");
    const fillStr = attrs.match(/\bfill=["']?([^"'\s>]+)["']?/)?.[1] || "#000000";
    const strokeStr = attrs.match(/\bstroke=["']?([^"'\s>]+)["']?/)?.[1];
    const strokeWidth = parseFloat(attrs.match(/\bstroke-width=["']?([0-9.-]+)["']?/)?.[1] || "1");

    if (r > 0) {
      const fillColor = parseHexOrRgbColor(fillStr);
      if (fillColor) {
        eps += `gs ${fillColor.r.toFixed(3)} ${fillColor.g.toFixed(3)} ${fillColor.b.toFixed(3)} rgb\n`;
        eps += `newpath ${cx.toFixed(2)} ${cy.toFixed(2)} ${r.toFixed(2)} 0 360 arc cp f gr\n`;
      }
      if (strokeStr && strokeStr !== "none") {
        const strokeColor = parseHexOrRgbColor(strokeStr);
        if (strokeColor) {
          eps += `gs ${strokeWidth} lw ${strokeColor.r.toFixed(3)} ${strokeColor.g.toFixed(3)} ${strokeColor.b.toFixed(3)} rgb\n`;
          eps += `newpath ${cx.toFixed(2)} ${cy.toFixed(2)} ${r.toFixed(2)} 0 360 arc cp s gr\n`;
        }
      }
    }
  }

  // 3. Paths <path ... />
  const pathRegex = /<path([^>]+)\/?>/gi;
  while ((match = pathRegex.exec(svgString)) !== null) {
    const attrs = match[1];
    const d = attrs.match(/\bd=["']([^"']+)["']/)?.[1];
    const fillStr = attrs.match(/\bfill=["']?([^"'\s>]+)["']?/)?.[1] || "#000000";
    const strokeStr = attrs.match(/\bstroke=["']?([^"'\s>]+)["']?/)?.[1];
    const strokeWidth = parseFloat(attrs.match(/\bstroke-width=["']?([0-9.-]+)["']?/)?.[1] || "1");

    if (d) {
      const fillColor = parseHexOrRgbColor(fillStr);
      const strokeColor = strokeStr && strokeStr !== "none" ? parseHexOrRgbColor(strokeStr) : null;

      if (fillColor || strokeColor) {
        const psPath = convertSvgPathToPostScript(d);
        if (psPath) {
          if (fillColor) {
            eps += `gs ${fillColor.r.toFixed(3)} ${fillColor.g.toFixed(3)} ${fillColor.b.toFixed(3)} rgb\n`;
            eps += `newpath\n${psPath}\ncp f gr\n`;
          }
          if (strokeColor) {
            eps += `gs ${strokeWidth} lw ${strokeColor.r.toFixed(3)} ${strokeColor.g.toFixed(3)} ${strokeColor.b.toFixed(3)} rgb\n`;
            eps += `newpath\n${psPath}\ns gr\n`;
          }
        }
      }
    }
  }

  eps += `
gr
showpage
%%Trailer
%%EOF
`;

  return eps;
}

/**
 * Tokenize and convert SVG path commands (d attribute) into PostScript path instructions
 */
function convertSvgPathToPostScript(d: string): string {
  let ps = "";
  // Tokenize commands and numbers
  const tokens = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?)/gi);
  if (!tokens || tokens.length === 0) return "";

  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  let i = 0;
  let currentCmd = "";

  while (i < tokens.length) {
    const token = tokens[i];
    if (/^[a-df-z]$/i.test(token)) {
      currentCmd = token;
      i++;
    }

    const isRelative = currentCmd === currentCmd.toLowerCase();
    const cmdUpper = currentCmd.toUpperCase();

    if (cmdUpper === "M") {
      const xVal = parseFloat(tokens[i++] || "0");
      const yVal = parseFloat(tokens[i++] || "0");
      currentX = isRelative ? currentX + xVal : xVal;
      currentY = isRelative ? currentY + yVal : yVal;
      startX = currentX;
      startY = currentY;
      ps += `${currentX.toFixed(2)} ${currentY.toFixed(2)} m\n`;
      // Subsequent numbers for M are treated as Lineto
      currentCmd = isRelative ? "l" : "L";
    } else if (cmdUpper === "L") {
      const xVal = parseFloat(tokens[i++] || "0");
      const yVal = parseFloat(tokens[i++] || "0");
      currentX = isRelative ? currentX + xVal : xVal;
      currentY = isRelative ? currentY + yVal : yVal;
      ps += `${currentX.toFixed(2)} ${currentY.toFixed(2)} l\n`;
    } else if (cmdUpper === "H") {
      const xVal = parseFloat(tokens[i++] || "0");
      currentX = isRelative ? currentX + xVal : xVal;
      ps += `${currentX.toFixed(2)} ${currentY.toFixed(2)} l\n`;
    } else if (cmdUpper === "V") {
      const yVal = parseFloat(tokens[i++] || "0");
      currentY = isRelative ? currentY + yVal : yVal;
      ps += `${currentX.toFixed(2)} ${currentY.toFixed(2)} l\n`;
    } else if (cmdUpper === "C") {
      const x1 = parseFloat(tokens[i++] || "0");
      const y1 = parseFloat(tokens[i++] || "0");
      const x2 = parseFloat(tokens[i++] || "0");
      const y2 = parseFloat(tokens[i++] || "0");
      const x = parseFloat(tokens[i++] || "0");
      const y = parseFloat(tokens[i++] || "0");

      const cp1x = isRelative ? currentX + x1 : x1;
      const cp1y = isRelative ? currentY + y1 : y1;
      const cp2x = isRelative ? currentX + x2 : x2;
      const cp2y = isRelative ? currentY + y2 : y2;
      currentX = isRelative ? currentX + x : x;
      currentY = isRelative ? currentY + y : y;

      ps += `${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${currentX.toFixed(2)} ${currentY.toFixed(2)} c\n`;
    } else if (cmdUpper === "Z") {
      currentX = startX;
      currentY = startY;
      ps += `cp\n`;
    } else {
      // Advance to next token to avoid infinite loop
      i++;
    }
  }

  return ps;
}
