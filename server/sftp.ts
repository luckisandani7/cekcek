import { Client } from "ssh2";
import { SftpConfig } from "../src/types";

export interface SftpUploadFile {
  filename: string;
  content: string | Buffer;
}

export interface SftpResult {
  success: boolean;
  message: string;
  uploadedCount?: number;
  details?: string[];
}

/**
 * Test connectivity and authentication to Adobe Stock Contributor SFTP
 */
export async function testAdobeStockSftp(config: SftpConfig): Promise<SftpResult> {
  const host = config.host || "sftp.contributor.adobestock.com";
  const port = config.port || 22;

  if (!config.username || !config.password) {
    return {
      success: false,
      message: "Username (ID Contributor) dan Password/Token SFTP wajib diisi."
    };
  }

  return new Promise((resolve) => {
    const conn = new Client();
    let isSettled = false;

    const timeout = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try {
          conn.end();
        } catch {}
        resolve({
          success: false,
          message: `Koneksi timeout ke ${host}:${port}. Pastikan kredensial SFTP Adobe Stock aktif.`
        });
      }
    }, 12000);

    conn
      .on("ready", () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeout);
          conn.sftp((err, sftp) => {
            conn.end();
            if (err) {
              resolve({
                success: false,
                message: `Berhasil login SSH tetapi gagal menginisialisasi sub-sistem SFTP: ${err.message}`
              });
            } else {
              resolve({
                success: true,
                message: `Koneksi SFTP ke ${host} berhasil! Akun Contributor (${config.username}) terverifikasi siap upload.`
              });
            }
          });
        }
      })
      .on("error", (err) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeout);
          let errorMsg = err.message;
          if (errorMsg.includes("authentication")) {
            errorMsg = "Autentikasi gagal. Periksa kembali Username (ID Contributor) dan SFTP Token dari dasbor Adobe Stock Contributor.";
          }
          resolve({
            success: false,
            message: `Gagal terhubung ke Adobe Stock SFTP: ${errorMsg}`
          });
        }
      })
      .connect({
        host,
        port,
        username: config.username.trim(),
        password: config.password.trim(),
        readyTimeout: 10000
      });
  });
}

/**
 * Upload multiple files directly to Adobe Stock SFTP
 */
export async function uploadFilesToAdobeStockSftp(
  config: SftpConfig,
  files: SftpUploadFile[]
): Promise<SftpResult> {
  const host = config.host || "sftp.contributor.adobestock.com";
  const port = config.port || 22;

  if (!config.username || !config.password) {
    return {
      success: false,
      message: "Username dan Password/Token SFTP wajib diisi."
    };
  }

  if (!files || files.length === 0) {
    return {
      success: false,
      message: "Tidak ada file yang dipilih untuk diunggah."
    };
  }

  return new Promise((resolve) => {
    const conn = new Client();
    let isSettled = false;
    const uploadedFiles: string[] = [];

    const timeout = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        try {
          conn.end();
        } catch {}
        resolve({
          success: false,
          message: `Koneksi SFTP timeout saat proses upload ke ${host}.`,
          uploadedCount: uploadedFiles.length,
          details: uploadedFiles
        });
      }
    }, 45000);

    conn
      .on("ready", () => {
        conn.sftp(async (err, sftp) => {
          if (err) {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeout);
              conn.end();
              resolve({
                success: false,
                message: `Gagal membuka sesi SFTP: ${err.message}`
              });
            }
            return;
          }

          try {
            for (const file of files) {
              const buffer = typeof file.content === "string" ? Buffer.from(file.content, "utf8") : file.content;
              const remotePath = file.filename;

              await new Promise<void>((uploadResolve, uploadReject) => {
                sftp.writeFile(remotePath, buffer, (writeErr) => {
                  if (writeErr) {
                    uploadReject(writeErr);
                  } else {
                    uploadedFiles.push(file.filename);
                    uploadResolve();
                  }
                });
              });
            }

            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeout);
              conn.end();
              resolve({
                success: true,
                message: `Sukses mengunggah ${uploadedFiles.length} file ke Adobe Stock SFTP! File akan otomatis masuk ke antrean dasbor Contributor dalam 2-15 menit.`,
                uploadedCount: uploadedFiles.length,
                details: uploadedFiles
              });
            }
          } catch (uploadError: any) {
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timeout);
              conn.end();
              resolve({
                success: false,
                message: `Terjadi kendala saat upload file: ${uploadError.message}`,
                uploadedCount: uploadedFiles.length,
                details: uploadedFiles
              });
            }
          }
        });
      })
      .on("error", (err) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timeout);
          resolve({
            success: false,
            message: `Koneksi SFTP error: ${err.message}`,
            uploadedCount: uploadedFiles.length,
            details: uploadedFiles
          });
        }
      })
      .connect({
        host,
        port,
        username: config.username.trim(),
        password: config.password.trim(),
        readyTimeout: 12000
      });
  });
}
