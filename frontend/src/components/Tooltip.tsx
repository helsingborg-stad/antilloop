import { FC } from "react";

import Tooltip, { TooltipProps } from "@mui/material/Tooltip";

const CustomTooltip: FC<TooltipProps> = ({ children, ...props }) => {
  return (
    <Tooltip
      {...props}
      slotProps={{
        tooltip: {
          className: "rounded bg-grey-700 px-2 py-1 text-xs text-grey-50"
        }
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
