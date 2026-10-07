import { getFormatter, getTranslations } from "next-intl/server";
import { getLotDetail } from "@/lib/data/lots";
import { pickLocalized } from "@/lib/localized";
import {
  OG_COLORS,
  OG_SIZE,
  OgBrand,
  ogFonts,
  ogJpegResponse,
  ogLocale,
  ogPhoto,
} from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/jpeg";
export const alt = "Lote · Tranquera de Paysandú";

const PHOTO_WIDTH = 560;

/** Share image of a lot: photo beside heads, category and average weight. */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; auction: string; lot: string }>;
}) {
  const { locale: rawLocale, auction, lot: lotNumber } = await params;
  const locale = ogLocale(rawLocale);
  const [t, format, fonts] = await Promise.all([
    getTranslations({ locale }),
    getFormatter({ locale }),
    ogFonts(),
  ]);
  const detail =
    /^\d+$/.test(auction) && /^\d+$/.test(lotNumber)
      ? await getLotDetail(Number(auction), Number(lotNumber)).catch(() => null)
      : null;
  const photo = await ogPhoto(
    detail?.lot.photos[0]?.url ??
      detail?.auction.imageUrl ??
      "/images/auctions/cover-4.webp",
    PHOTO_WIDTH,
    OG_SIZE.height,
  );

  const auctionLine = detail
    ? [
        t("auction.title", { number: detail.auction.number }),
        format.dateTime(new Date(detail.auction.startsAt), "dayMonth"),
      ].join(" · ")
    : "";
  const stats = detail
    ? [
        { label: t("lot.heads"), value: format.number(detail.lot.headCount, "integer") },
        { label: t("lot.category"), value: t(`lotCategory.${detail.lot.category}`) },
        {
          label: t("lot.avgWeight"),
          value: t("units.kg", {
            value: format.number(detail.lot.avgWeightKg, "integer"),
          }),
        },
      ]
    : [];

  return ogJpegResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: OG_COLORS.primaryStrong,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: OG_SIZE.width - PHOTO_WIDTH,
          padding: 56,
        }}
      >
        <OgBrand name={t("brand.shortName")} place={t("brand.place")} />
        {detail && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 700,
                fontSize: 24,
                color: OG_COLORS.straw,
              }}
            >
              {auctionLine}
            </span>
            <span
              style={{
                fontFamily: "Bitter",
                fontSize: 72,
                color: OG_COLORS.paper,
                marginTop: 6,
              }}
            >
              {t("lot.title", { number: detail.lot.number })}
            </span>
            <span
              style={{
                fontFamily: "Archivo",
                fontSize: 28,
                color: "#f7f3eacc",
                marginTop: 2,
              }}
            >
              {pickLocalized(detail.lot.breed, locale)}
            </span>
            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    padding: "16px 18px",
                    borderRadius: 14,
                    background: "#f7f3ea14",
                    border: "1px solid #f7f3ea33",
                  }}
                >
                  <span
                    style={{ fontFamily: "Archivo", fontSize: 18, color: "#f7f3eab3" }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "Bitter",
                      fontSize: 30,
                      color: OG_COLORS.paper,
                      marginTop: 4,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        <img src={photo} width={PHOTO_WIDTH} height={OG_SIZE.height} />
      )}
    </div>,
    fonts,
  );
}
