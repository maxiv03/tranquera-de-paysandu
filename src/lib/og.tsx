import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hasLocale } from "next-intl";
import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import sharp from "sharp";
import { routing, type Locale } from "@/i18n/routing";

// Shared pieces of the Open Graph images (next/og): 1200×630 PNG, site fonts and colors.

export const OG_SIZE = { width: 1200, height: 630 };

/** Full-canvas absolute layer (next/og does not support `inset`). */
export const OG_FILL = {
  position: "absolute",
  top: 0,
  left: 0,
  width: 1200,
  height: 630,
} as const;

/**
 * Renders with next/og (PNG only) and re-encodes as JPEG: photo backgrounds make the PNG
 * 1–1.5 MB, too heavy for WhatsApp previews; the JPEG is ~10× smaller.
 */
export async function ogJpegResponse(
  element: ReactElement,
  fonts: Awaited<ReturnType<typeof ogFonts>>,
) {
  const png = Buffer.from(
    await new ImageResponse(element, { ...OG_SIZE, fonts }).arrayBuffer(),
  );
  const jpeg = await sharp(png).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

/** The route locale, validated (OG routes receive it as a plain string). */
export function ogLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

export const OG_COLORS = {
  primary: "#2e4a36",
  primaryStrong: "#1c2e22",
  paper: "#f7f3ea",
  straw: "#d8b25c",
  accent: "#8f5a34",
  ink: "#1e231f",
};

const fontsDir = join(process.cwd(), "src", "assets", "fonts");

export async function ogFonts() {
  const [bitter, archivoMedium, archivoBold] = await Promise.all([
    readFile(join(fontsDir, "Bitter-Bold.ttf")),
    readFile(join(fontsDir, "Archivo-Medium.ttf")),
    readFile(join(fontsDir, "Archivo-Bold.ttf")),
  ]);
  return [
    { name: "Bitter", data: bitter, weight: 700 as const, style: "normal" as const },
    {
      name: "Archivo",
      data: archivoMedium,
      weight: 500 as const,
      style: "normal" as const,
    },
    {
      name: "Archivo",
      data: archivoBold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * A local image from public/ as a JPEG data URI (next/og cannot decode WebP), cropped to the
 * given box. The files are bundled with the OG routes through outputFileTracingIncludes.
 */
export async function ogPhoto(
  publicPath: string | null | undefined,
  width: number,
  height: number,
) {
  if (!publicPath) return null;
  try {
    const file = await readFile(join(process.cwd(), "public", publicPath));
    const jpeg = await sharp(file)
      .resize(width, height, { fit: "cover" })
      .jpeg({ quality: 78 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

/** The farm-gate mark as a data URI (same drawing as LogoMark / icon.svg). */
export const OG_MARK = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#2e4a36"/><g stroke="#f7f3ea" stroke-linecap="round"><path d="M7 8v17M25 8v17" stroke-width="2.4"/><path d="M7 11h18M7 16.5h18M7 22h18" stroke-width="2"/><path d="M8 22 24 11" stroke="#d8b25c" stroke-width="2"/></g></svg>`,
).toString("base64")}`;

/** Brand lockup for the top of every OG image. */
export function OgBrand({ name, place }: { name: string; place: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={OG_MARK} width={52} height={52} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontFamily: "Bitter", fontSize: 30, color: OG_COLORS.paper }}>
          {name}
        </span>
        <span
          style={{
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: 4,
            color: OG_COLORS.straw,
            marginTop: 6,
            textTransform: "uppercase",
          }}
        >
          {place}
        </span>
      </div>
    </div>
  );
}
