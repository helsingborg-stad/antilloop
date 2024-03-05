import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import Icon from "@/components/Icon";
import IconButton from "./IconButton";
import i18n from "@/i18n";

interface UserMenuProps {
  admin?: boolean;
}

const UserMenu: FC<UserMenuProps> = ({ admin }) => {
  const [t] = useTranslation();

  const selectedLanguage = localStorage.getItem("antiloop_locale") || "sv";

  const options = [
    { id: 1, key: "sv", name: "Svenska", icon: "flag-sv" },
    { id: 2, key: "en", name: "English", icon: "flag-en" }
  ];

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "language-menu" : undefined;

  useEffect(() => {
    if (!["en", "sv"].includes(selectedLanguage)) {
      localStorage.setItem("antiloop_locale", "sv");
      i18n.changeLanguage("sv");
      window.location.reload();
    }
  }, [selectedLanguage]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: string) => {
    localStorage.setItem("antiloop_locale", language);
    i18n.changeLanguage(language);
    window.location.reload();
  };

  return (
    <>
      <IconButton
        variant={admin ? "grey" : "white"}
        onClick={handleClick}
        aria-describedby={id}
        a11y={t("a11y.buttons.language_menu", {
          language:
            options.find((item) => item.key === selectedLanguage)?.name ||
            "Svenska"
        })}
        icon={`flag-${selectedLanguage}`}
        aria-expanded={open}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        className="mt-4"
        slotProps={{
          paper: { className: "rounded-24 min-w-[160px] shadow-material" }
        }}
      >
        <List>
          {options.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={() => handleLanguageChange(item.key)}
                className="group p-2 text-grey-800 hover:text-blue-500"
                aria-label={
                  selectedLanguage === item.key
                    ? `${item.name}: ${t("a11y.current_selected")}.`
                    : undefined
                }
                role="button"
              >
                <div className="mr-2 rounded-full bg-secondary p-[6px]">
                  <Icon className="h-5 w-5" name={item.icon} />
                </div>
                <span>{item.name}</span>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default UserMenu;
