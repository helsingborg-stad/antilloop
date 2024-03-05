import React, { FC, forwardRef } from "react";

const Layout: FC<{
  children: React.ReactNode;
  ref?: React.ForwardedRef<HTMLDivElement>;
}> = forwardRef(({ children }, ref) => {
  return (
    <div ref={ref} className="md:flex md:gap-4">
      {children}
    </div>
  );
});

export default Layout;
