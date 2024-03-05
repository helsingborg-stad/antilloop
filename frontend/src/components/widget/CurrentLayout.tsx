import React, { FC } from "react";

interface CurrentLayoutProps {
  children: React.ReactNode[] | React.ReactNode;
  id: string;
}

const CurrentLayout: FC<CurrentLayoutProps> = ({ children, id }) => {
  return (
    <div
      id={id}
      className="sm:flex sm:gap-4 md:w-[360px] md:shrink-0 md:flex-col md:gap-0 2xl:w-auto 2xl:flex-row 2xl:gap-4"
    >
      {children}
    </div>
  );
};

export default CurrentLayout;
