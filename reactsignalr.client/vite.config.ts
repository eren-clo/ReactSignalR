import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import child_process from "child_process";
import { env } from "process";

const baseFolder =
  env.APPDATA !== undefined && env.APPDATA !== ""
    ? `${env.APPDATA}/ASP.NET/https`
    : `${env.HOME}/.aspnet/https`;

const certificateName = "reactsignalr.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (
    0 !==
    child_process.spawnSync(
      "dotnet",
      [
        "dev-certs",
        "https",
        "--export-path",
        certFilePath,
        "--format",
        "Pem",
        "--no-password",
      ],
      { stdio: "inherit" },
    ).status
  ) {
    throw new Error("Could not create certificate.");
  }
}

const target = env.ASPNETCORE_HTTPS_PORT
  ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
  : env.ASPNETCORE_URLS
    ? env.ASPNETCORE_URLS.split(";")[0]
    : "https://localhost:7093";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    proxy: {
      "/imageHub": {
        target: "http://192.168.1.38:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/merchantHub": {
        target: "http://192.168.1.38:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/travellerHub": {
        target: "http://192.168.1.38:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/posHub": {
        target: "http://192.168.1.38:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/ImageUpload": {
        target: "http://192.168.1.38:5000",
        changeOrigin: true,
        secure: false,
      },
      "/SendCommand": {
        target: "http://192.168.1.38:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    port: 5001,
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath),
    },
  },
});
