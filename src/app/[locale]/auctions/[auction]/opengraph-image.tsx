import { getFormatter, getTranslations } from "next-intl/server";
import { getAuction } from "@/lib/data/auctions";
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
export const alt = "Remate · Tranquera de Paysandú";

/** Share image of an auction: cover photo, date, type and number of lots. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; auction: string }>;
}) {
  const { locale: rawLocale, auction: number } = await params;
  const locale = ogLocale(rawLocale);
  const [t, format, fonts] = await Promise.all([
    getTranslations({ locale }),
    getFormatter({ locale }),
    ogFonts(),
  ]);
  const auction = /^\d+$/.test(number)
    ? await getAuction(Number(number)).catch(() => null)
    : null;
  const photo = await ogPhoto(
    auction?.imageUrl ?? "/images/auctions/cover-4.webp",
    OG_SIZE.width,
    OG_SIZE.height,
  );
  const startsAt = auction ? new Date(auction.startsAt) : null;
  const live = auction?.status === "live";
  const dateLine = startsAt
    ? [
        format.dateTime(startsAt, "long"),
        t("units.time", { time: format.dateTime(startsAt, "time") }),
      ].join(" · ")
    : "";
  const summaryLine = auction
    ? [
        t("units.lots", { count: auction.lotCount }),
        t("units.heads", { count: auction.headCount }),
      ].join(" · ")
    : "";

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
          background: `linear-gradient(90deg, ${OG_COLORS.primaryStrong}f5 0%, ${OG_COLORS.primaryStrong}d9 60%, ${OG_COLORS.primaryStrong}66 100%)`,
        }}
      >
        <OgBrand name={t("brand.shortName")} place={t("brand.place")} />
        {auction && startsAt ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontFamily: "Archivo",
                fontWeight: 700,
                fontSize: 22,
                color: live ? OG_COLORS.paper : OG_COLORS.ink,
                background: live ? "#b3261e" : OG_COLORS.straw,
                padding: "8px 18px",
                borderRadius: 999,
              }}
            >
              {live
                ? t("auctionStatus.live").toUpperCase()
                : t(`auctionType.${auction.type}`)}
            </span>
            <span
              style={{
                fontFamily: "Bitter",
                fontSize: 76,
                color: OG_COLORS.paper,
                marginTop: 22,
              }}
            >
              {t("auction.title", { number: auction.number })}
            </span>
            {auction.title && (
              <span
                style={{
                  fontFamily: "Archivo",
                  fontWeight: 700,
                  fontSize: 34,
                  color: OG_COLORS.straw,
                }}
              >
                {auction.title}
              </span>
            )}
            <span
              style={{
                fontFamily: "Archivo",
                fontSize: 30,
                color: "#f7f3eae6",
                marginTop: 26,
              }}
            >
              {dateLine}
            </span>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 700,
                fontSize: 30,
                color: OG_COLORS.paper,
                marginTop: 8,
              }}
            >
              {summaryLine}
            </span>
          </div>
        ) : (
          <span style={{ fontFamily: "Bitter", fontSize: 64, color: OG_COLORS.paper }}>
            {t("auctions.title")}
          </span>
        )}
      </div>
    </div>,
    fonts,
  );
}
