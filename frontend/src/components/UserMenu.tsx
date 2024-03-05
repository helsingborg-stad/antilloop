import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ButtonBase from "@mui/material/ButtonBase";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import { AppContext } from "@/context/AppContext";
import Icon from "@/components/Icon";
import { deleteCookie } from "@/utils/cookieProvider";

interface UserMenuProps {
  admin?: boolean;
}

const UserMenu: FC<UserMenuProps> = ({ admin }) => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const { state, dispatch } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-menu" : undefined;

  const handleAdminRedirect = () =>
    navigate(`/${state.currentUser?.school.id}/workspace`);

  const logout = () => {
    deleteCookie("antiloop_token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <ButtonBase
        aria-describedby={id}
        onClick={handleClick}
        aria-label={t("a11y.buttons.user_menu")}
        className={`group rounded-64 p-2 text-sm text-black ring-blue-500  transition-all hover:text-blue-500 focus-visible:ring-2 sm:pr-4 ${
          admin ? "bg-grey-100" : "bg-white shadow-material-s"
        }`}
        aria-expanded={open}
      >
        <span className="rounded-full bg-secondary p-[3px] group-hover:bg-blue-100">
          <Icon className="group-hover:fill-blue-500" name="user" />
        </span>
        <span className="ml-2 hidden sm:inline-block">
          {state.currentUser?.name}
        </span>
      </ButtonBase>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        className="mt-4"
        slotProps={{
          paper: { className: "rounded-24 min-w-[176px] shadow-material" }
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleAdminRedirect}
              className="group p-2 hover:text-blue-500"
            >
              <div className="mr-2 rounded-full bg-secondary p-[6px]">
                <Icon
                  className="h-5 w-5 group-hover:fill-blue-500"
                  name="work-space"
                />
              </div>
              {t("work_space")}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              className="group p-2 hover:text-blue-500"
            >
              <div className="mr-2 rounded-full bg-secondary p-[6px]">
                <Icon
                  className="h-5 w-5 group-hover:fill-blue-500"
                  name="logout"
                />
              </div>
              {t("logout")}
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
};

export default UserMenu;
