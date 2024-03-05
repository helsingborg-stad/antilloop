import { FC } from "react";

import { ReactComponent as Login } from "@/assets/icons/login.svg";
import { ReactComponent as Logout } from "@/assets/icons/logout.svg";
import { ReactComponent as WorkSpace } from "@/assets/icons/work_space.svg";
import { ReactComponent as User } from "@/assets/icons/user.svg";
import { ReactComponent as CollapseMenu } from "@/assets/icons/collapse_menu.svg";
import { ReactComponent as Close } from "@/assets/icons/close.svg";
import { ReactComponent as SchoolDashboard } from "@/assets/icons/school_dashboard.svg";
import { ReactComponent as Page } from "@/assets/icons/page.svg";
import { ReactComponent as Sensor } from "@/assets/icons/sensor.svg";
import { ReactComponent as Settings } from "@/assets/icons/settings.svg";
import { ReactComponent as ArrowRight } from "@/assets/icons/arrow_right.svg";
import { ReactComponent as ArrowLeft } from "@/assets/icons/arrow_left.svg";
import { ReactComponent as Apps } from "@/assets/icons/apps.svg";
import { ReactComponent as Helsinborg } from "@/assets/icons/helsinborg.svg";
import { ReactComponent as Home } from "@/assets/icons/home.svg";
import { ReactComponent as Battery } from "@/assets/icons/battery.svg";
import { ReactComponent as Integration } from "@/assets/icons/integration.svg";
import { ReactComponent as ArrowRightLarge } from "@/assets/icons/arrow_right_large.svg";
import { ReactComponent as InfoRound } from "@/assets/icons/info_round.svg";
import { ReactComponent as Like } from "@/assets/icons/like.svg";
import { ReactComponent as Caret } from "@/assets/icons/caret.svg";
import { ReactComponent as Leaves } from "@/assets/icons/leaves.svg";
import { ReactComponent as Check } from "@/assets/icons/check.svg";
import { ReactComponent as Back } from "@/assets/icons/back.svg";
import { ReactComponent as Weather } from "@/assets/icons/weather.svg";
import { ReactComponent as Footprint } from "@/assets/icons/footprint.svg";
import { ReactComponent as Prev } from "@/assets/icons/prev.svg";
import { ReactComponent as FlagEN } from "@/assets/icons/flag_en.svg";
import { ReactComponent as FlagSV } from "@/assets/icons/flag_sv.svg";

interface IconProps {
  name: string;
  className?: string;
}

const Icon: FC<IconProps> = ({ name, ...props }) => {
  switch (name) {
    case "login":
      return <Login {...props} />;
    case "logout":
      return <Logout {...props} />;
    case "work-space":
      return <WorkSpace {...props} />;
    case "user":
      return <User {...props} />;
    case "collapse-menu":
      return <CollapseMenu {...props} />;
    case "close":
      return <Close {...props} />;
    case "school-dashboard":
      return <SchoolDashboard {...props} />;
    case "page":
      return <Page {...props} />;
    case "sensor":
      return <Sensor {...props} />;
    case "integration":
      return <Integration {...props} />;
    case "settings":
      return <Settings {...props} />;
    case "arrow-right":
      return <ArrowRight {...props} />;
    case "arrow-left":
      return <ArrowLeft {...props} />;
    case "apps":
      return <Apps {...props} />;
    case "home":
      return <Home {...props} />;
    case "helsinborg":
      return <Helsinborg {...props} />;
    case "battery":
      return <Battery {...props} />;
    case "arrow-right-large":
      return <ArrowRightLarge {...props} />;
    case "info-round":
      return <InfoRound {...props} />;
    case "like":
      return <Like {...props} />;
    case "caret":
      return <Caret {...props} />;
    case "leaves":
      return <Leaves {...props} />;
    case "check":
      return <Check {...props} />;
    case "back":
      return <Back {...props} />;
    case "weather":
      return <Weather {...props} />;
    case "footprint":
      return <Footprint {...props} />;
    case "prev":
      return <Prev {...props} />;
    case "flag-en":
      return <FlagEN {...props} />;
    case "flag-sv":
      return <FlagSV {...props} />;
    default:
      return null;
  }
};

export default Icon;
