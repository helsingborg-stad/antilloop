import { FC } from "react";

interface SoundIconProps {
  variant?: string;
  className: string;
}

const SoundIcon: FC<SoundIconProps> = ({ variant, className }) => {
  const ExtremeCold = () => (
    <>
      <path
        d="M38 49C38 52.866 34.866 56 31 56C27.134 56 24 52.866 24 49C24 45.134 27.134 42 31 42C34.866 42 38 45.134 38 49Z"
        fill="url(#paint0_linear_56153_36686)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_56153_36686"
          x1="31.0001"
          y1="54.3958"
          x2="31"
          y2="-40.0556"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.244792" stopColor="#3FAD1F" />
          <stop offset="0.482144" stopColor="#CCA400" />
          <stop offset="0.739094" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );

  const ColdBelow = () => (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31 38C29.8954 38 29 38.8954 29 40V42.2899C26.1085 43.1504 24 45.829 24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49C38 45.829 35.8915 43.1504 33 42.2899V40C33 38.8954 32.1046 38 31 38Z"
        fill="url(#paint0_linear_56153_33812)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_56153_33812"
          x1="31.0001"
          y1="53.9375"
          x2="30.9999"
          y2="-67.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.244792" stopColor="#3FAD1F" />
          <stop offset="0.482144" stopColor="#CCA400" />
          <stop offset="0.739094" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );

  const ColdAbove = () => (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31 32C29.8954 32 29 32.8954 29 34V42.2899C26.1085 43.1504 24 45.829 24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49C38 45.829 35.8915 43.1504 33 42.2899V34C33 32.8954 32.1046 32 31 32Z"
        fill="url(#paint0_linear_56153_34155)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_56153_34155"
          x1="31"
          y1="56"
          x2="30.9999"
          y2="-22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.244792" stopColor="#3FAD1F" />
          <stop offset="0.482144" stopColor="#CCA400" />
          <stop offset="0.739094" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );
  const Cool = () => (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31 25C29.8954 25 29 25.8954 29 27V42.2899C26.1085 43.1504 24 45.829 24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49C38 45.829 35.8915 43.1504 33 42.2899V27C33 25.8954 32.1046 25 31 25Z"
        fill="url(#paint0_linear_56153_30453)"
      />

      <defs>
        <linearGradient
          id="paint0_linear_56153_30453"
          x1="31"
          y1="63"
          x2="30.9998"
          y2="-39"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.244792" stopColor="#3FAD1F" />
          <stop offset="0.482144" stopColor="#CCA400" />
          <stop offset="0.739094" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );
  const Warm = () => (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31 18C29.8954 18 29 18.8954 29 20V42.2899C26.1085 43.1504 24 45.829 24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49C38 45.829 35.8915 43.1504 33 42.2899V20C33 18.8954 32.1046 18 31 18Z"
        fill="url(#paint0_linear_56153_9533)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_56153_9533"
          x1="31.0001"
          y1="74.5"
          x2="30.9999"
          y2="-25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.244792" stopColor="#3FAD1F" />
          <stop offset="0.482144" stopColor="#CCA400" />
          <stop offset="0.739094" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );

  const Heat = () => (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31 12C29.8954 12 29 12.8954 29 14V42.2899C26.1085 43.1504 24 45.829 24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49C38 45.829 35.8915 43.1504 33 42.2899V14C33 12.8954 32.1046 12 31 12Z"
        fill="url(#paint0_linear_56153_35728)"
      />

      <defs>
        <linearGradient
          id="paint0_linear_56153_35728"
          x1="31"
          y1="102.5"
          x2="30.9998"
          y2="-11"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.210306" stopColor="#3FAD1F" />
          <stop offset="0.429926" stopColor="#CCA400" />
          <stop offset="0.739094" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );
  const ExtremeHeat = () => (
    <>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31 8C29.8954 8 29 8.89543 29 10V42.2899C26.1085 43.1504 24 45.829 24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49C38 45.829 35.8915 43.1504 33 42.2899V10C33 8.89543 32.1046 8 31 8Z"
        fill="url(#paint0_linear_56153_22207)"
      />

      <defs>
        <linearGradient
          id="paint0_linear_56153_22207"
          x1="31"
          y1="102.5"
          x2="30.9998"
          y2="8"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#006FCC" />
          <stop offset="0.244792" stopColor="#3FAD1F" />
          <stop offset="0.329176" stopColor="#CCA400" />
          <stop offset="0.687333" stopColor="#CC1C00" />
          <stop offset="1" stopColor="#701782" />
        </linearGradient>
      </defs>
    </>
  );

  const NoData = () => (
    <>
      <path
        d="M24 49C24 52.866 27.134 56 31 56C34.866 56 38 52.866 38 49H24Z"
        fill="#191C1E"
      />
    </>
  );

  const Variant = () =>
    variant === "extremeCold" ? (
      <ExtremeCold />
    ) : variant === "coldBelow" ? (
      <ColdBelow />
    ) : variant === "coldAbove" ? (
      <ColdAbove />
    ) : variant === "cool" ? (
      <Cool />
    ) : variant === "warm" ? (
      <Warm />
    ) : variant === "heat" ? (
      <Heat />
    ) : variant === "extremeHeat" ? (
      <ExtremeHeat />
    ) : (
      <NoData />
    );

  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 38.0436L25.0784 39.728L26 39.138V38.0436H24ZM38 38.0436H36V39.138L36.9216 39.728L38 38.0436ZM26 9C26 6.23858 28.2386 4 31 4V0C26.0294 0 22 4.02944 22 9H26ZM26 38.0436V9H22V38.0436H26ZM20 49C20 45.1078 22.02 41.686 25.0784 39.728L22.9216 36.3593C18.7633 39.0215 16 43.6874 16 49H20ZM31 60C24.9249 60 20 55.0751 20 49H16C16 57.2843 22.7157 64 31 64V60ZM42 49C42 55.0751 37.0751 60 31 60V64C39.2843 64 46 57.2843 46 49H42ZM36.9216 39.728C39.98 41.686 42 45.1078 42 49H46C46 43.6874 43.2367 39.0215 39.0784 36.3593L36.9216 39.728ZM36 9V38.0436H40V9H36ZM31 4C33.7614 4 36 6.23858 36 9H40C40 4.02944 35.9706 0 31 0V4Z"
        fill="#191C1E"
      />
      <Variant />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46 9C44.8954 9 44 9.89543 44 11C44 12.1046 44.8954 13 46 13H50C51.1046 13 52 12.1046 52 11C52 9.89543 51.1046 9 50 9H46ZM44 19C44 17.8954 44.8954 17 46 17H50C51.1046 17 52 17.8954 52 19C52 20.1046 51.1046 21 50 21H46C44.8954 21 44 20.1046 44 19ZM44 27C44 25.8954 44.8954 25 46 25H50C51.1046 25 52 25.8954 52 27C52 28.1046 51.1046 29 50 29H46C44.8954 29 44 28.1046 44 27Z"
        fill="#191C1E"
      />
    </svg>
  );
};

export default SoundIcon;
