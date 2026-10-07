import { getTranslations } from "next-intl/server";
import {
  OG_COLORS,
  OG_FILL,
  OG_SIZE,
  OgBrand,
  ogFonts,
  ogJpegResponse,
  ogLocale,
  ogPhoto,
} from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/jpeg";
export const alt = "Tranquera de Paysandú";

/** Default share image for every page: brand statement over a field photo. */
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = ogLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "brand" });
  const home = await getTranslations({ locale, namespace: "home" });
  const [fonts, photo] = await Promise.all([
    ogFonts(),
    ogPhoto("/images/auctions/cover-4.webp", OG_SIZE.width, OG_SIZE.height),
  ]);

  return ogJpegResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={photo} width={OG_SIZE.width} height={OG_SIZE.height} style={OG_FILL} />
      )}
      <div
        style={{
          ...OG_FILL,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: `linear-gradient(90deg, ${OG_COLORS.primaryStrong}f2 0%, ${OG_COLORS.primaryStrong}cc 55%, ${OG_COLORS.primaryStrong}55 100%)`,
        }}
      >
        <OgBrand name={t("shortName")} place={t("place")} />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <span
            style={{
              fontFamily: "Bitter",
              fontSize: 64,
              lineHeight: 1.1,
              color: OG_COLORS.paper,
            }}
          >
            {home("title")}
          </span>
          <span
            style={{
              fontFamily: "Archivo",
              fontSize: 28,
              marginTop: 20,
              color: "#f7f3eacc",
            }}
          >
            {t("tagline")}
          </span>
        </div>
      </div>
    </div>,
    fonts,
  );
}
