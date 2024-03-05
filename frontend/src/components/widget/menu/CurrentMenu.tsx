import { FC } from "react";
import { useTranslation } from "react-i18next";

import MenuImg from "@/assets/img/foodWaste/menu.png";

import { FoodMenuLatestData } from "@/types/school";

const Menu: FC<{ latestData: FoodMenuLatestData }> = ({ latestData }) => {
  const [t] = useTranslation();

  return (
    <>
      <div className="flex h-full items-center gap-4 rounded-32 bg-yellow-500 p-6">
        <img className="h-16 w-16" src={MenuImg} alt="" />
        <div>
          <p className="text-lg font-medium">{t("food_menu.menu")}</p>
          <p className="line-clamp-2">{latestData?.items.join(", ")}</p>
        </div>
      </div>
    </>
  );
};

export default Menu;
