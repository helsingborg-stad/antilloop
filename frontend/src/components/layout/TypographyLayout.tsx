import { Outlet } from "react-router-dom";

import Header from "@/components/Header";

const TypographyLayout = () => {
  document.documentElement.style.setProperty("--body-bg-color", "#dbecdf");

  return (
    <>
      <Header typography />
      <Outlet />
    </>
  );
};

export default TypographyLayout;
