import { useTranslation } from "react-i18next";

const Pages = () => {
  const [t] = useTranslation();

  return (
    <main className="flex max-h-[calc(100vh-104px)] w-full flex-grow flex-col gap-6 rounded-2xl bg-white p-4">
      <h1 className="px-4 py-2 text-[22px] font-medium">{t("pages")}</h1>
    </main>
  );
};

export default Pages;
