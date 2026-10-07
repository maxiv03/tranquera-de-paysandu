import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="container-page flex flex-1 flex-col justify-center py-16">
      <p className="text-sm font-semibold tracking-widest text-accent uppercase">
        {t("brand.name")}
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-tight font-bold sm:text-5xl">
        {t("home.title")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">{t("home.intro")}</p>
    </div>
  );
}
