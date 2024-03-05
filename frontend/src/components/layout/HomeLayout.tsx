import { Outlet } from "react-router-dom";

import Header from "@/components/Header";

const HomeLayout = () => {
  document.documentElement.style.setProperty("--body-bg-color", "#dbecdf");

  return (
    <>
      <Header home />
      <Outlet />
    </>
  );
};

export default HomeLayout;
