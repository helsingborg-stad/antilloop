import { FC } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

interface BinIconProps {
  fillHeight: number | null;
  className?: string;
  iconVariant: string;
}

const BinIcon: FC<BinIconProps> = ({ className, fillHeight, iconVariant }) => {
  const Variant = () =>
    iconVariant === "dry" ? (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.6228 23.1277C41.776 21.4906 41.8572 19.1788 42.8158 17.671C45.099 14.0803 50.9997 13.8169 53.9891 14.7913C53.1211 16.1569 52.8168 17.7282 52.519 19.2656C52.1051 21.4027 51.7038 23.4745 49.819 24.8379C48.7169 25.635 47.2439 25.8983 45.8191 25.5321C43.8469 27.9837 41.7682 31.1303 40.1246 34.9118C42.48 34.6691 45.0535 35.6439 46.4833 37.3598C46.8368 37.784 46.7795 38.4146 46.3552 38.7682C45.9309 39.1217 45.3004 39.0644 44.9468 38.6401C43.9367 37.4278 41.9181 36.6613 40.1223 36.9272C39.8108 36.9733 39.5122 37.0497 39.2307 37.1575C37.5214 41.8778 36.5544 47.4563 37.2046 53.7959C37.4439 56.1283 37.6546 58.7007 37.8403 61.4532C38.8257 60.2194 40.0115 59.1877 41.35 58.3883C45.8213 55.7178 51.7579 55.7839 57.0308 59.2009C57.726 59.6514 57.9244 60.5802 57.4738 61.2754C57.0233 61.9706 56.0945 62.169 55.3993 61.7185C50.997 58.8656 46.2907 58.9318 42.8883 60.9639C40.7195 62.2592 38.9819 64.4135 38.186 67.3122C39.2151 87.2799 39.2151 113.547 39.2151 127.927V128H35.2151C35.2151 109.952 35.2126 73.5769 33.2255 54.2041C33.1149 53.1255 33.0465 52.0671 33.0169 51.0292C32.2319 47.8395 29.9292 45.8361 27.405 45.1327C24.5626 44.3405 21.5796 45.2073 19.9926 47.7863C19.5584 48.4918 18.6345 48.7118 17.9289 48.2777C17.2234 47.8435 17.0034 46.9196 17.4375 46.2141C19.8505 42.2927 24.3244 41.1598 28.2104 42.2428C30.0794 42.7636 31.845 43.7995 33.2473 45.2994C33.8655 39.693 35.5787 34.8143 37.6796 30.7384C37.4115 29.8655 36.8345 29.1457 36.0902 28.6395C34.7966 27.7598 33.0826 27.5845 31.7111 28.368C31.2315 28.6419 30.6207 28.4752 30.3467 27.9957C30.0728 27.5161 30.2395 26.9053 30.719 26.6313C32.8475 25.4155 35.3835 25.7404 37.2149 26.9857C37.8504 27.4179 38.4111 27.9678 38.8498 28.6123C40.068 26.5336 41.3648 24.7013 42.6228 23.1277Z"
        fill="white"
      />
    ) : iconVariant === "ok" ? (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.6225 23.1277C41.7757 21.4906 41.8568 19.1788 42.8155 17.671C45.0987 14.0803 50.9994 13.8169 53.9887 14.7913C53.1207 16.1569 52.8164 17.7282 52.5187 19.2656C52.1047 21.4027 51.7035 23.4745 49.8186 24.8379C48.7166 25.635 47.2436 25.8983 45.8188 25.5321C43.6229 28.2617 41.2951 31.8528 39.5828 36.2225C40.2028 36.0815 40.8226 36.0201 41.3916 35.9961C41.8231 33.6917 43.5952 32.088 45.5603 31.848C47.8695 31.566 49.5724 32.8122 51.3291 34.0977C52.5929 35.0225 53.8844 35.9677 55.4495 36.3788C53.9202 39.1259 49.4146 42.9453 45.2988 41.8649C43.5707 41.4113 41.9391 39.7714 41.4468 37.9952C40.8574 38.0185 40.2529 38.0885 39.6552 38.2709C39.3369 38.368 39.0208 38.4978 38.7165 38.676C37.3355 43.0603 36.6225 48.1235 37.2043 53.796C37.5057 56.7346 37.762 60.0544 37.9798 63.6355C39.0982 62.4949 40.3986 61.6803 41.5838 61.1577C40.6901 58.2165 41.4642 55.1722 43.4187 53.231C46.1445 50.5239 49.659 50.3932 53.2844 50.2583C55.8926 50.1613 58.5581 50.0621 61.0286 49C61.8719 54.0778 59.9351 63.5543 53.4392 66.3484C50.0789 67.7938 45.0477 66.7801 42.9241 63.8465C42.0254 64.225 40.9615 64.8621 40.0696 65.7897C39.2251 66.668 38.5329 67.8038 38.282 69.2624C39.2147 88.9611 39.2147 114.01 39.2147 127.927V128H35.2147C35.2147 111.028 35.2125 77.8493 33.5599 57.8432C33.1014 56.3192 32.1264 55.2279 31.0314 54.4979C30.3323 54.0319 29.5994 53.7258 28.9572 53.5637C28.7716 53.5168 28.6031 53.4843 28.4529 53.4627C26.6213 56.2064 22.5361 57.8436 19.3134 57.2585C12.3558 55.9954 8.33923 47.1965 8.02002 42.059C10.666 42.5388 13.2856 42.0365 15.8489 41.545C19.4119 40.8619 22.8659 40.1996 26.1303 42.225C28.7448 43.8473 30.2333 47.1414 29.5569 50.6221C29.6018 50.6327 29.6467 50.6436 29.6914 50.6549C30.6587 50.899 31.707 51.3428 32.6954 52.0017C32.821 52.0854 32.9459 52.1729 33.0697 52.264C32.6517 45.0021 34.1379 38.7078 36.374 33.5034C36.3647 33.4318 36.3522 33.3553 36.3359 33.2742C36.2484 32.8362 36.0679 32.3396 35.8017 31.8606C35.5254 31.3631 35.1864 30.9335 34.8095 30.6077C33.3663 31.9809 30.7665 32.3905 28.9662 31.6017C25.0686 29.8942 23.9066 24.103 24.4125 20.9999C25.8948 21.649 27.4942 21.7096 29.059 21.7689C31.2343 21.8513 33.343 21.9312 34.9784 23.5855C36.2585 24.8804 36.6947 26.9784 35.9068 28.9209C36.6061 29.4689 37.1571 30.1819 37.5501 30.8893L37.577 30.9381C39.1345 27.8783 40.9142 25.2645 42.6225 23.1277Z"
        fill="white"
      />
    ) : iconVariant === "wet" ? (
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.6226 23.1277C41.7758 21.4906 41.8569 19.1788 42.8156 17.671C45.0988 14.0803 50.9995 13.8169 53.9888 14.7913C53.1209 16.1569 52.8165 17.7282 52.5188 19.2656C52.1049 21.4027 51.7036 23.4745 49.8187 24.8379C48.7167 25.635 47.2437 25.8983 45.8189 25.5321C43.8467 27.9837 41.768 31.1303 40.1244 34.9118C41.2082 34.8001 42.3382 34.9462 43.3816 35.3037C44.914 34.1431 47.384 33.9226 49.0678 34.7624C52.8756 36.6617 53.7482 42.5035 53.0885 45.5776C51.6403 44.8556 50.046 44.7156 48.486 44.5785C46.3176 44.388 44.2154 44.2033 42.6643 42.4697C41.4309 41.0912 41.1086 38.9281 42.0455 37.0041C41.4125 36.8678 40.7535 36.8337 40.1221 36.9272C39.8106 36.9733 39.5119 37.0497 39.2305 37.1575C37.5212 41.8778 36.5542 47.4563 37.2044 53.7959C37.4698 56.3832 37.7001 59.2659 37.9001 62.3622C38.6436 61.4625 39.5202 60.7008 40.5029 60.0971C44.099 57.8876 48.856 57.9581 53.0469 60.7519C53.7362 61.2114 53.9225 62.1427 53.4629 62.832C53.0034 63.5213 52.0721 63.7076 51.3828 63.2481C48.0737 61.0421 44.5807 61.1126 42.0734 62.6532C40.1163 63.8555 38.6003 66.0549 38.2756 69.1238C39.2149 88.8435 39.2148 113.978 39.2148 127.927V128H35.2148C35.2148 109.952 35.2124 73.5769 33.2253 54.2041C33.0415 52.4119 32.9743 50.6754 33.0076 48.9963C32.2523 47.8761 31.0212 46.9212 29.5228 46.3337C27.1342 45.397 24.7004 45.6357 23.2755 47.0606C22.6897 47.6464 21.74 47.6464 21.1542 47.0606C20.5684 46.4748 20.5684 45.525 21.1542 44.9392C23.7293 42.3642 27.5886 42.3527 30.6181 43.5407C31.5454 43.9044 32.4545 44.4032 33.2787 45.0212C33.8826 39.8688 35.4095 35.3374 37.303 31.4859C37.1594 30.3992 36.6418 29.5889 35.9998 29.1198C35.617 28.84 35.1402 28.6461 34.5997 28.5889C34.6602 30.5201 33.6824 32.2369 32.1893 33.067C30.1562 34.1974 28.1094 33.6838 25.998 33.154C24.4791 32.7729 22.9268 32.3834 21.3221 32.5916C21.705 29.4709 24.4417 24.2365 28.6614 23.6883C30.7183 23.421 33.2564 24.6841 34.1459 26.5693C35.248 26.539 36.295 26.8584 37.1799 27.505C37.7532 27.924 38.2255 28.4568 38.5805 29.0776C39.8757 26.8061 41.2715 24.8177 42.6226 23.1277Z"
        fill="white"
      />
    ) : null;

  return (
    <svg
      className={className}
      width="74"
      height="128"
      viewBox="0 0 74 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42 0C49.8439 0 56.3695 5.64443 57.7366 13.0932C65.7563 13.9587 72 20.7502 72 29C72 31.6237 71.3685 34.0999 70.2491 36.2849C72.5591 38.4721 74 41.5678 74 45C74 49.8467 71.1266 54.0223 66.9904 55.9163C66.9968 56.1101 67 56.3047 67 56.5C67 66.165 59.165 74 49.5 74C47.3076 74 45.2094 73.5969 43.2755 72.8606C42.0256 74.1856 40.4177 75.1693 38.6065 75.6569C38.6987 78.3958 38.777 81.1893 38.8434 84H54.6C56.8402 84 57.9603 84 58.816 84.436C59.5686 84.8195 60.1805 85.4314 60.564 86.184C61 87.0397 61 88.1598 61 90.4V95.6C61 97.8402 61 98.9603 60.564 99.816C60.1805 100.569 59.5686 101.181 58.816 101.564C58.5358 101.707 58.2274 101.803 57.8605 101.867C57.7701 103.069 57.6122 104.49 57.4207 106.213L57.4207 106.214L56.2652 116.614C55.8178 120.64 55.5941 122.653 54.6653 124.173C53.8471 125.511 52.6535 126.579 51.233 127.245C49.6204 128 47.5947 128 43.5435 128H30.4565C26.4053 128 24.3796 128 22.767 127.245C21.3465 126.579 20.1529 125.511 19.3347 124.173C18.4059 122.653 18.1822 120.64 17.7348 116.614L16.5793 106.214C16.3878 104.49 16.2299 103.069 16.1395 101.867C15.7726 101.803 15.4642 101.707 15.184 101.564C14.4314 101.181 13.8195 100.569 13.436 99.816C13 98.9603 13 97.8402 13 95.6V90.4C13 88.1598 13 87.0397 13.436 86.184C13.8195 85.4314 14.4314 84.8195 15.184 84.436C16.0397 84 17.1598 84 19.4 84H34.8425C34.7779 81.2716 34.702 78.5616 34.6131 75.9046C31.8868 75.5263 29.512 74.049 27.9505 71.9345C26.4412 72.6189 24.7651 73 23 73C18.5556 73 14.6756 70.5839 12.6016 66.9935C6.15862 66.7834 1 61.4941 1 55C1 51.648 2.37437 48.617 4.59034 46.4398C1.79523 44.2427 0 40.831 0 37C0 32.7748 2.1837 29.0596 5.48407 26.9215C5.16793 25.6667 5 24.3529 5 23C5 14.1634 12.1634 7 21 7C23.4492 7 25.7698 7.5503 27.8451 8.534C30.5276 3.45865 35.8599 0 42 0Z"
        fill="white"
        fillOpacity="0.3"
      />
      <Variant />
      <mask
        id="mask0_56386_25673"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="74"
        height="128"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42 0C49.8439 0 56.3695 5.64443 57.7366 13.0932C65.7563 13.9587 72 20.7502 72 29C72 31.6237 71.3685 34.0999 70.2491 36.2849C72.5591 38.4721 74 41.5678 74 45C74 49.8467 71.1266 54.0223 66.9904 55.9163C66.9968 56.1101 67 56.3047 67 56.5C67 66.165 59.165 74 49.5 74C47.3076 74 45.2094 73.5969 43.2755 72.8606C41.9634 74.2515 40.257 75.2662 38.3349 75.7259C38.4326 78.4345 38.5159 81.205 38.5869 84H54.6C56.8402 84 57.9603 84 58.816 84.436C59.5686 84.8195 60.1805 85.4314 60.564 86.184C61 87.0397 61 88.1598 61 90.4V95.6C61 97.8402 61 98.9603 60.564 99.816C60.1805 100.569 59.5686 101.181 58.816 101.564C58.5358 101.707 58.2274 101.803 57.8605 101.867C57.7701 103.069 57.6122 104.49 57.4207 106.213L57.4207 106.214L56.2652 116.614C55.8178 120.64 55.5941 122.653 54.6653 124.173C53.8471 125.511 52.6535 126.579 51.233 127.245C49.6204 128 47.5947 128 43.5435 128L39 128H35L30.4565 128C26.4053 128 24.3796 128 22.767 127.245C21.3465 126.579 20.1529 125.511 19.3347 124.173C18.4059 122.653 18.1822 120.64 17.7348 116.614L16.5793 106.214C16.3878 104.49 16.2299 103.069 16.1395 101.867C15.7726 101.803 15.4642 101.707 15.184 101.564C14.4314 101.181 13.8195 100.569 13.436 99.816C13 98.9603 13 97.8402 13 95.6V90.4C13 88.1598 13 87.0397 13.436 86.184C13.8195 85.4314 14.4314 84.8195 15.184 84.436C16.0397 84 17.1598 84 19.4 84H34.5859C34.5158 81.2494 34.4338 78.5249 34.3378 75.8625C31.7272 75.4257 29.4592 73.9776 27.9505 71.9345C26.4412 72.6189 24.7651 73 23 73C18.5556 73 14.6756 70.5839 12.6016 66.9935C6.15862 66.7834 1 61.4941 1 55C1 51.648 2.37437 48.617 4.59034 46.4398C1.79523 44.2427 0 40.831 0 37C0 32.7748 2.1837 29.0596 5.48407 26.9215C5.16793 25.6667 5 24.3529 5 23C5 14.1634 12.1634 7 21 7C23.4492 7 25.7698 7.5503 27.8451 8.534C30.5276 3.45865 35.8599 0 42 0Z"
          fill="#356A21"
        />
      </mask>
      <g mask="url(#mask0_56386_25673)">
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            <m.path
              initial={{ translateY: 0 }}
              animate={{
                translateY: -(fillHeight ? fillHeight / 100 : 0) * 34
              }}
              transition={{ delay: 0.2 }}
              d="M45.9998 123.019C41.9997 123.019 40.9998 120.019 36.9998 120.019C32.9998 120.019 31.9998 123.019 27.9998 123.019C23.9998 123.019 22.9998 120.019 18.9998 120.019C14.9998 120.019 13.9998 123.019 9.99975 123.019C5.99975 123.019 4.99976 120.019 0.999756 120.019C-3.00024 120.019 -4 123.019 -8 123.019C-7.99957 126.999 -8 263.999 -8 263.999H81.9997C81.9997 263.999 81.9997 127.999 81.9997 122.999C77.9997 122.999 76.9997 120 72.9997 120C68.9997 120 67.9997 123.019 63.9997 123.019C59.9997 123.019 58.9998 120.019 54.9998 120.019C50.9998 120.02 49.9998 123.019 45.9998 123.019Z"
              fill="white"
            />
          </AnimatePresence>
        </LazyMotion>
      </g>
    </svg>
  );
};

export default BinIcon;