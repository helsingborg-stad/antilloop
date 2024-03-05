import { FC, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LikeView from "./LikeView";
import RangePickerOptions from "../RangePickerOptions";
import FilterButton from "@/components/FilterButton";
import Modal from "@/components/Modal";
import IconButton from "@/components/IconButton";

import MenuImg from "@/assets/img/foodWaste/menu.png";

import { getWidgetData } from "@/api/school";
import { likeMenu } from "@/api/widget";
import { MenuItem } from "@/types/school";
import {
  getEndOfWeek,
  formatDate,
  getStartOfWeek,
  addTime,
  substractTime
} from "@/utils/helpers";

interface MenuProps {
  id: number;
  quickLinkId: string;
}

const Menu: FC<MenuProps> = ({ id, quickLinkId }) => {
  const [t] = useTranslation();
  const queryClient = useQueryClient();

  const now = useMemo(() => new Date(), []);
  const lastWeek = substractTime(now, { days: 7 });
  const nextWeek = addTime(now, { days: 7 });

  const getRange = (date: Date) => ({
    from: formatDate(getStartOfWeek(date)).dashSeparated,
    to: formatDate(getEndOfWeek(date)).dashSeparated
  });

  const menuNotes = useMemo(
    () => Array.from({ length: 6 }, (_, i) => t(`food_menu.note.${i + 1}`)),
    [t]
  );

  const rangeOptions = useMemo(
    () => [
      {
        key: "last",
        label: t("food_menu.range.last_week"),
        range: getRange(lastWeek)
      },
      {
        key: "current",
        label: t("food_menu.range.current_week"),
        range: getRange(now)
      },
      {
        key: "next",
        label: t("food_menu.range.next_week"),
        range: getRange(nextWeek)
      }
    ],
    [lastWeek, now, nextWeek, t]
  );

  const [rangeUpdated, setRangeUpdated] = useState(false);
  const [range, setRange] = useState("current");
  const [rangeModal, setRangeModal] = useState(false);

  const getSelectedRange = (key: string) =>
    rangeOptions?.find((item) => item.key === key);

  const like = useMutation({
    mutationFn: likeMenu
  });

  const { data } = useQuery({
    queryKey: ["menu", id, getSelectedRange(range)?.range],
    queryFn: () =>
      getWidgetData({
        id,
        ...getSelectedRange(range)?.range
      })
  });

  const toggleRangeModal = () => setRangeModal(!rangeModal);

  const rangeLabel = getSelectedRange(range)?.label || "";

  const handleLike = (menuId: number) => {
    like.mutate(
      { widgetId: id, itemId: menuId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["menu", id, getSelectedRange(range)?.range]
          });
        }
      }
    );
  };

  const onRangeChange = (range: string) => {
    if (range === "current") {
      setRangeUpdated(false);
    } else {
      setRangeUpdated(true);
    }
    setRange(range);
  };
  const resetRange = () => {
    setRangeUpdated(false);
    setRange("current");
  };

  const shuffleNotes = (array: string[]) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const shuffledNotes = useMemo(
    () => range && shuffleNotes(menuNotes),
    [menuNotes, range]
  );

  return (
    <>
      <div
        id={quickLinkId}
        className="mt-8 w-full rounded-[40px] bg-yellow-500 p-6"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img className="h-12 w-12" src={MenuImg} alt="" />
            <p className="text-lg font-semibold">{t("food_menu.menu")}</p>
          </div>
          <div>
            {rangeUpdated && (
              <IconButton
                size="small"
                variant="white"
                className="mr-2"
                icon="close"
                onClick={resetRange}
                a11y={t("a11y.buttons.reset_selected_range")}
              />
            )}
            <FilterButton
              variant="white"
              onClick={toggleRangeModal}
              label={rangeLabel}
            />
          </div>
        </div>
        <div className="no-scrollbar -mx-6 flex min-h-[120px] items-start gap-2 overflow-x-auto pr-6 transition-all">
          <LazyMotion features={domAnimation}>
            {data?.map((item: MenuItem, index: number) => {
              const wasteForDay = item.assoc_data.find(
                (item) => item.data_source_key === "food_waste_helsingborg"
              )?.data.waste_in_g;

              return (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.06 }}
                  key={item.id}
                  className="shrink-0 basis-[176px] rounded-24 bg-white p-4 pb-2 first:ml-6 lg:flex-1 lg:basis-1"
                >
                  <p className="mb-4 font-semibold">
                    {formatDate(item.data.date).dayName}
                  </p>
                  {wasteForDay ? (
                    <div className="mb-4 rounded-xl bg-blue-70 p-2 ">
                      <p className="flex gap-1 text-sm font-semibold">
                        <span>{t("food_menu.waste")}</span>
                        <span>{Number((wasteForDay / 1000).toFixed(1))}</span>
                        <span>{t("food_waste.kg")}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4 rounded-xl bg-yellow-300 p-2">
                      <p className="flex gap-1 text-xs">
                        {shuffledNotes[index]}
                      </p>
                    </div>
                  )}
                  <p className="mb-4">{item.data.items.join(", ")}</p>
                  <LikeView
                    key={item.likes_count}
                    count={item.likes_count}
                    onLike={() => handleLike(item.id)}
                  />
                </m.div>
              );
            })}
          </LazyMotion>
        </div>
      </div>
      <Modal
        open={rangeModal}
        title={t("time_period")}
        toggleModal={toggleRangeModal}
        testId="food-menu-range"
      >
        <div className="no-scrollbar sm:w-[320px]">
          <RangePickerOptions
            onSubmit={onRangeChange}
            onCancel={toggleRangeModal}
            rangeOptions={rangeOptions}
            range={range}
          />
        </div>
      </Modal>
    </>
  );
};

export default Menu;
