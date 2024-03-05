import { FC } from "react";

interface SoundIconProps {
  variant: string;
  className: string;
  iconStrokeColor: string | null;
}

const SoundIcon: FC<SoundIconProps> = ({
  variant,
  className,
  iconStrokeColor
}) => {
  const NoData = () => (
    <>
      <path
        d="M47 49H42"
        stroke="#191C1E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M58 49H53.0001"
        stroke="#191C1E"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  );

  const Good = () => (
    <>
      <circle cx="50" cy="49" r="10" fill="#008A00" />
      <path
        d="M49.7831 53.1889C49.3681 53.6382 49.1606 53.8629 48.9183 53.9444C48.7054 54.016 48.4747 54.0139 48.2632 53.9383C48.0224 53.8524 47.8191 53.6239 47.4125 53.167L43.7158 49.0132C43.2399 48.4784 43.2636 47.6654 43.7697 47.1592C44.2613 46.6677 45.0455 46.6292 45.5828 47.0703L48.5857 49.5356L54.4399 44.2921C54.9582 43.8279 55.749 43.8496 56.241 44.3417C56.7385 44.8392 56.7544 45.6407 56.2771 46.1576L49.7831 53.1889Z"
        fill="white"
      />
    </>
  );

  const Medium = () => (
    <>
      <path
        d="M48.285 39.8583C49.0618 38.5636 50.9382 38.5636 51.715 39.8583L60.1826 53.971C60.9824 55.3041 60.0222 57 58.4676 57H41.5324C39.9778 57 39.0176 55.3041 39.8174 53.971L48.285 39.8583Z"
        fill="#FFBF00"
      />
      <circle cx="50" cy="54.5" r="1.5" fill="#231B00" />
      <path
        d="M48.1051 43.9972C48.048 42.9116 48.9129 42 50 42C51.0871 42 51.952 42.9116 51.8949 43.9972L51.5788 50.0021C51.5346 50.8418 50.8409 51.5 50 51.5C49.1591 51.5 48.4654 50.8418 48.4212 50.0021L48.1051 43.9972Z"
        fill="#231B00"
      />
    </>
  );
  const Poor = () => (
    <>
      <circle cx="50" cy="49" r="10" fill="#BE0A18" />
      <circle cx="50" cy="54.5" r="1.5" fill="white" />
      <path
        d="M48.1051 43.9972C48.048 42.9116 48.9129 42 50 42C51.0871 42 51.952 42.9116 51.8949 43.9972L51.5788 50.0021C51.5346 50.8418 50.8409 51.5 50 51.5C49.1591 51.5 48.4654 50.8418 48.4212 50.0021L48.1051 43.9972Z"
        fill="white"
      />
    </>
  );

  const Variant = () =>
    variant === "noData" ? (
      <NoData />
    ) : variant === "good" ? (
      <Good />
    ) : variant === "medium" ? (
      <Medium />
    ) : (
      <Poor />
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
        d="M35 56C33 59 29.7811 61 25.5152 61C19.1555 61 14 55.7767 14 49.3333L14 24.8333C14 14.2019 22.5066 5 33 5C43.4934 5 52 13.6185 52 24.25C52 28.3755 51 31 50.5 33"
        stroke="#191C1E"
        className={iconStrokeColor || ""}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M22 40L22 24.6286C22 18.2505 27.1653 13 33 13C39.0751 13 44 17.9696 44 24.1C44 25.4791 43.7554 26.7916 43.3082 28"
        stroke="#191C1E"
        className={iconStrokeColor || ""}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M22 32H29.5486C34.3886 32 37.2367 37.4359 34.4817 41.4153L32 45"
        stroke="#191C1E"
        className={iconStrokeColor || ""}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Variant />
    </svg>
  );
};

export default SoundIcon;
