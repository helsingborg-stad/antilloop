import { FC } from "react";
import Waste from "@/assets/img/foodWaste/waste.jpg";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

interface BinIconProps {
  fillHeight: number;
  className: string;
}

const BinIcon: FC<BinIconProps> = ({ className, fillHeight }) => {
  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="pattern0"
          patternUnits="userSpaceOnUse"
          width="60"
          height="80"
        >
          <image
            id="image0_55757_99359"
            x="0"
            y="0"
            width="60"
            height="80"
            href={Waste}
          />
        </pattern>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26 1C22.134 1 19 4.13401 19 8V11H7C5.34315 11 4 12.3431 4 14C4 15.6569 5.34315 17 7 17H8L11.2359 53.4036C11.6678 58.2625 16.0004 62 21.2013 62H42.744C47.9395 62 52.2695 58.27 52.7082 53.4166L56 17H57C58.6569 17 60 15.6569 60 14C60 12.3431 58.6569 11 57 11H44V8C44 4.13401 40.866 1 37 1H26ZM38 11V8C38 7.44771 37.5523 7 37 7H26C25.4477 7 25 7.44772 25 8V11H38Z"
        fill="white"
      />
      <mask
        id="mask0_55757_99359"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="8"
        y="17"
        width="48"
        height="45"
      >
        <path
          d="M8 17H56L52.7082 53.4166C52.2695 58.27 47.9395 62 42.744 62H21.2013C16.0004 62 11.6678 58.2625 11.2359 53.4036L8 17Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_55757_99359)">
        <rect x="2" y="8" width="60" height="60" fill="url(#pattern0)" />
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            <m.path
              initial={{ translateY: 0 }}
              animate={{ translateY: -(fillHeight / 100) * 46 }}
              transition={{ delay: 0.2 }}
              d="M8 62.5304C8 62.5304 10.1264 65 13.6889 65C17.1022 65 18.24 62.5304 22.7911 62.5304C27.3422 62.5304 27.3422 65 31.8933 65C36.4444 65 36.4444 62.5305 40.9956 62.5304C45.5467 62.5303 46.6845 65 50.0978 65C53.5111 65 56 62.5304 56 62.5304V17L8 17V62.5304Z"
              fill="white"
            />
          </AnimatePresence>
        </LazyMotion>
      </g>
    </svg>
  );
};

export default BinIcon;
