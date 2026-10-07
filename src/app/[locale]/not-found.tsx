import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-page flex flex-1 flex-col items-start justify-center py-16">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-3 max-w-lg text-ink-muted">{t("description")}</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
