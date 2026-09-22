import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateSingleVectorWithGemini } from "./server/gemini";
import { testAdobeStockSftp, uploadFilesToAdobeStockSftp, SftpUploadFile } from "./server/sftp";
import { convertSvgToEps } from "./src/utils/epsConverter";
import { generateAdobeStockCsv } from "./src/utils/csvGenerator";
import { GeneratedVectorAsset, BatchGenerationRequest } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API 1: Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // API 2: Generate Vector Batch + Adobe Stock Metadata
  app.post("/api/vector/generate-batch", async (req, res) => {
    try {
      const { objectPrompt, styleId = "flat-modern", paletteId = "vibrant-modern", count = 3 } = req.body as BatchGenerationRequest;

      if (!objectPrompt || typeof objectPrompt !== "string" || objectPrompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Prompt objek atau subjek vector wajib diisi."
        });
      }

      const safeCount = Math.max(1, Math.min(10, Number(count) || 3));
      const cleanPrompt = objectPrompt.trim();

      console.log(`[Batch Generation] Generating ${safeCount} vectors in parallel for: "${cleanPrompt}"`);

      // Run vector generation in parallel for maximum speed
      const variationIndices = Array.from({ length: safeCount }, (_, i) => i);
      const results = await Promise.all(
        variationIndices.map((i) =>
          generateSingleVectorWithGemini(
            cleanPrompt,
            styleId,
            paletteId,
            i,
            safeCount
          )
        )
      );

      const generatedAssets: GeneratedVectorAsset[] = results.map((singleResult, i) => {
        // Convert generated SVG to standard PostScript EPS-10
        const epsCode = convertSvgToEps(singleResult.svgCode, {
          title: singleResult.metadata.title,
          keywords: singleResult.metadata.keywords,
          width: 800,
          height: 800
        });

        return {
          id: `vec_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
          filename: singleResult.metadata.filename,
          prompt: cleanPrompt,
          style: styleId,
          palette: paletteId,
          svgCode: singleResult.svgCode,
          epsCode,
          metadata: singleResult.metadata,
          createdAt: new Date().toISOString(),
          uploadStatus: "idle"
        };
      });

      return res.json({
        success: true,
        count: generatedAssets.length,
        assets: generatedAssets
      });
    } catch (err: any) {
      console.error("[Batch Generation Error]", err);
      return res.status(500).json({
        success: false,
        error: `Gagal men-generate vector: ${err.message}`
      });
    }
  });

  // API 3: Test SFTP Connection to Adobe Stock Contributor
  app.post("/api/adobestock/test-connection", async (req, res) => {
    try {
      const { host = "sftp.contributor.adobestock.com", port = 22, username, password } = req.body;
      const result = await testAdobeStockSftp({
        host,
        port: Number(port) || 22,
        username,
        password
      });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: `Internal server error testing SFTP: ${err.message}`
      });
    }
  });

  // API 4: Direct Upload to Adobe Stock via Contributor SFTP
  app.post("/api/adobestock/upload-sftp", async (req, res) => {
    try {
      const {
        sftpConfig,
        assets = [],
        targetFormat = "both", // 'svg' | 'eps' | 'both'
        includeCsv = true
      } = req.body;

      if (!sftpConfig || !sftpConfig.username || !sftpConfig.password) {
        return res.status(400).json({
          success: false,
          message: "Kredensial SFTP Adobe Stock (Username & Password) belum lengkap."
        });
      }

      if (!Array.isArray(assets) || assets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Pilih minimal satu asset vector untuk diunggah."
        });
      }

      const filesToUpload: SftpUploadFile[] = [];

      for (const asset of assets) {
        const baseName = (asset.filename || "vector_asset").replace(/\.(svg|eps)$/i, "");

        if ((targetFormat === "svg" || targetFormat === "both") && asset.svgCode) {
          filesToUpload.push({
            filename: `${baseName}.svg`,
            content: asset.svgCode
          });
        }

        if ((targetFormat === "eps" || targetFormat === "both") && asset.epsCode) {
          filesToUpload.push({
            filename: `${baseName}.eps`,
            content: asset.epsCode
          });
        }
      }

      // Also add CSV metadata if requested
      if (includeCsv && assets.length > 0) {
        const csvItems = assets.map((a: any) => ({
          filename: a.filename,
          metadata: a.metadata,
          targetFormat: targetFormat as any
        }));
        const csvContent = generateAdobeStockCsv(csvItems);
        filesToUpload.push({
          filename: `adobe_stock_metadata_${Date.now()}.csv`,
          content: csvContent
        });
      }

      console.log(`[Adobe Stock SFTP] Uploading ${filesToUpload.length} files for user ${sftpConfig.username}...`);

      const result = await uploadFilesToAdobeStockSftp(sftpConfig, filesToUpload);
      return res.json(result);
    } catch (err: any) {
      console.error("[Adobe Stock SFTP Error]", err);
      return res.status(500).json({
        success: false,
        message: `Gagal proses upload: ${err.message}`
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VectorStock AI server running on http://localhost:${PORT}`);
  });
}

startServer();
