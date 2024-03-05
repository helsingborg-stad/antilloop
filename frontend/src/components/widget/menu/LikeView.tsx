import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import SVG1 from "@/assets/img/smallAnimals/1.svg";
import SVG2 from "@/assets/img/smallAnimals/2.svg";
import SVG3 from "@/assets/img/smallAnimals/3.svg";
import SVG4 from "@/assets/img/smallAnimals/4.svg";
import SVG5 from "@/assets/img/smallAnimals/5.svg";
import SVG6 from "@/assets/img/smallAnimals/6.svg";
import SVG7 from "@/assets/img/smallAnimals/7.svg";
import SVG8 from "@/assets/img/smallAnimals/8.svg";
import SVG9 from "@/assets/img/smallAnimals/9.svg";
import SVG10 from "@/assets/img/smallAnimals/10.svg";
import SVG11 from "@/assets/img/smallAnimals/11.svg";
import IconButton from "@/components/IconButton";

interface LikeViewProps {
  count: number;
  onLike: () => void;
}

const LikeView: FC<LikeViewProps> = ({ count, onLike }) => {
  const [t] = useTranslation();

  const images = [
    SVG1,
    SVG2,
    SVG3,
    SVG4,
    SVG5,
    SVG6,
    SVG7,
    SVG8,
    SVG9,
    SVG10,
    SVG11
  ];

  const getRandomElementsFromArray = useCallback(
    (arr: typeof images, numRandomElements: number) => {
      if (arr.length === 0 || numRandomElements <= 0) {
        return [];
      }

      const shuffledArray = arr.slice();
      const randomElements = [];

      while (randomElements.length < Math.min(numRandomElements, arr.length)) {
        const randomIndex = Math.floor(Math.random() * shuffledArray.length);
        randomElements.push(shuffledArray.splice(randomIndex, 1)[0]);
      }

      return randomElements;
    },
    []
  );

  const [selected] = useState<typeof images>(() => {
    if (count <= 3) {
      return getRandomElementsFromArray(images, count);
    } else {
      return getRandomElementsFromArray(images, 3);
    }
  });

  const rest = count <= 3 ? null : count - 3;

  const handleLike = () => {
    onLike();
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {selected.map((icon, index) => {
          return (
            <img
              className="-ml-4 first:ml-0 "
              key={index}
              src={icon}
              alt="small animal"
            />
          );
        })}
      </div>
      {rest && <p className="text-xs font-semibold">+{rest}</p>}
      <IconButton
        className="-mr-1 ml-auto"
        icon="like"
        a11y={t("a11y.buttons.like_menu")}
        onClick={handleLike}
      />
    </div>
  );
};

export default LikeView;
