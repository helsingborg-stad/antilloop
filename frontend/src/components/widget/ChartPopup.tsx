import { useTranslation } from "react-i18next";

import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";

import IconButton from "@/components/IconButton";

interface ChartPopupProps {
  anchorEl: SVGRectElement | null;
  title: string;
  handleClose: () => void;
  content: { menu: string[]; y?: number } | null;
  a11yCloseText: string;
}

const ChartPopup = ({
  anchorEl,
  title,
  content,
  a11yCloseText,
  handleClose
}: ChartPopupProps) => {
  const [t] = useTranslation();

  return (
    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="right-end"
      disablePortal={true}
      slotProps={{
        root: {
          className: "z-10"
        }
      }}
      modifiers={[
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: false,
            rootBoundary: "document",
            padding: 8
          }
        }
      ]}
      transition
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <div className="w-[176px] rounded-2xl bg-white p-4 shadow-tooltip">
            <div className="-mr-2 -mt-2 mb-2 flex items-center justify-between">
              {!content?.y && <h6 className="font-medium">{title}</h6>}
              <IconButton
                size="small"
                onClick={handleClose}
                icon="close"
                className="ml-auto"
                a11y={a11yCloseText}
              />
            </div>
            {content?.y && (
              <div>
                <div className="mb-4 rounded-xl bg-blue-70 p-2 ">
                  <p className="font-semibold">
                    <span className="block">{t("food_menu.waste")}</span>
                    <span className="text-[32px]">{content.y}</span>
                    <span className="text-sm font-normal">
                      {t("food_waste.kg")}
                    </span>
                  </p>
                </div>
              </div>
            )}
            {content?.y && <h6 className="mb-4 font-medium">{title}</h6>}
            <p>{content?.menu}</p>
          </div>
        </Grow>
      )}
    </Popper>
  );
};

export default ChartPopup;
