import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Icon from "@/components/Icon";
import Button from "@/components/Button";

const PageNotFound: FC = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  document.documentElement.style.setProperty("--body-bg-color", "#E5F9E1");

  const handleClick = () => navigate("/");

  return (
    <main className="w-full px-4 pt-24 lg:pt-[166px]">
      <div className="mx-auto flex max-w-[560px] flex-col gap-8 rounded-32 bg-white p-10">
        <Icon name="leaves" />
        <div>
          <h1 className="mb-4 text-[22px] font-medium">
            {t("page_not_found")}
          </h1>
          <p className="mb-4">{t("page_not_found_description")}</p>
          <Button onClick={handleClick} variant="primary">
            {t("to_home")}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default PageNotFound;
