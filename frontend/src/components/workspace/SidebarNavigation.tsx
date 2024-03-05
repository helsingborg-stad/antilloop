import { FC, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";

const SidebarNavigation = () => {
  const [t] = useTranslation();
  const matches = useMediaQuery("(min-width:1024px)");
  const navigate = useNavigate();
  const [open, setOpen] = useState(matches);
  const location = useLocation();

  const [active, setActive] = useState("school");

  const toggleOpen = () => setOpen(!open);

  const nav = useMemo(
    () => [
      {
        to: "school",
        title: t("school_home"),
        icon: "school-dashboard"
      },
      { to: "pages", title: t("pages"), icon: "page" },
      { divider: true },
      { to: "sensors", title: t("sensors"), icon: "sensor" },
      { to: "integrations", title: t("integrations"), icon: "integration" },
      { divider: true },
      { to: "settings", title: t("school_settings"), icon: "settings" }
    ],
    [t]
  );

  useEffect(() => {
    nav.forEach((item) => {
      if (location && item.to && location.pathname.includes(item.to)) {
        setActive(item.to);
      }
    });
  }, [location, nav]);

  const handleLinkClick = (to: string) => {
    setActive(to);
    navigate(to);
    !matches && setOpen(false);
  };

  return (
    <LazyMotion features={domAnimation}>
      <aside
        className={`rounded-2xl bg-gray-100 p-2 lg:w-auto lg:p-3 ${
          open ? "w-full" : "w-auto"
        }`}
      >
        <IconButton
          icon="collapse-menu"
          size={matches ? "large" : "default"}
          onClick={toggleOpen}
          aria-expanded={open}
          a11y={t("a11y.buttons.expand_menu")}
        />

        <AnimatePresence>
          {open && (
            <m.ul
              initial={{ opacity: 0, width: 0, height: 0, marginTop: 0 }}
              animate={{
                opacity: 1,
                width: "auto",
                height: "auto",
                marginTop: 24
              }}
              exit={{ opacity: 0, width: 0, height: 0, marginTop: 0 }}
              className="mt-6 flex flex-col gap-2"
              role="list"
            >
              {nav.map((item, index: number) => (
                <NavItem
                  active={active}
                  key={index}
                  handleLinkClick={handleLinkClick}
                  {...item}
                />
              ))}
            </m.ul>
          )}
        </AnimatePresence>
      </aside>
    </LazyMotion>
  );
};

interface NavItemProps {
  title?: string;
  to?: string;
  divider?: boolean;
  icon?: string;
  active: string;
  handleLinkClick: (to: string) => void;
}

const NavItem: FC<NavItemProps> = ({
  title,
  to,
  divider,
  icon,
  handleLinkClick,
  active
}) => {
  const selected = active === to;

  return divider ? (
    <span
      role="separator"
      aria-hidden="true"
      className="mx-4 my-2 border-b border-divider"
    ></span>
  ) : to && icon ? (
    <ListItem disablePadding disableGutters role="listitem">
      <ListItemButton
        component="button"
        onClick={() => handleLinkClick(to)}
        aria-selected={selected}
        disableGutters
        className={`flex w-full items-center gap-3 whitespace-nowrap rounded-100 p-4 text-sm font-medium ring-blue-500 transition-all hover:bg-[#191C1E14] focus-visible:ring-2 lg:w-[256px] ${
          selected ? "bg-lime-300 hover:bg-lime-300" : ""
        }`}
      >
        <Icon className="shrink-0" name={icon} />
        {title}
      </ListItemButton>
    </ListItem>
  ) : null;
};

export default SidebarNavigation;
