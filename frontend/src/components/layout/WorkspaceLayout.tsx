import { useContext } from "react";
import { Outlet, Navigate /* useParams */ } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AppContext } from "@/context/AppContext";
import Header from "@/components/Header";
import SidebarNavigation from "@/components/workspace/SidebarNavigation";

import { getCookieByName } from "@/utils/cookieProvider";
import { Helmet } from "react-helmet-async";

const WorkspaceLayout = () => {
  const [t] = useTranslation();
  const { state } = useContext(AppContext);
  const isLoggedIn = getCookieByName("antiloop_token");

  document.documentElement.style.setProperty("--body-bg-color", "#f8f9fb");

  if (!isLoggedIn && !state.currentUser) return <Navigate to="/" />;

  return (
    <>
      <Helmet>
        <title>
          {state.currentUser?.school.name
            ? `${t("work_space")} | ${state.currentUser.school.name} | Antiloop`
            : "Antiloop"}
        </title>
      </Helmet>
      <Header admin />
      <div className="flex flex-col items-start gap-4 p-4 pt-[72px] sm:pt-[88px] lg:max-h-screen lg:flex-row lg:overflow-hidden">
        <SidebarNavigation />
        <Outlet />
      </div>
    </>
  );
};

export default WorkspaceLayout;
