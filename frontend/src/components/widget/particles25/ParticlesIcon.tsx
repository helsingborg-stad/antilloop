import { FC } from "react";

interface ParticlesIconProps {
  variant?: string;
  className: string;
}

const ParticlesIcon: FC<ParticlesIconProps> = ({ variant, className }) => {
  const fill =
    variant === "good"
      ? "#0972D6"
      : variant === "moderate"
      ? "#356A21"
      : variant === "poor"
      ? "#725C00"
      : variant === "bad"
      ? "#BE0A18"
      : variant === "noData"
      ? "#40484C"
      : "";

  const bg =
    variant === "good"
      ? "#0972D6"
      : variant === "moderate"
      ? "#356A21"
      : variant === "poor"
      ? "#725C00"
      : variant === "bad"
      ? "#BE0A18"
      : variant === "noData"
      ? "#191C1E"
      : "";

  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_56206_16604)">
        <circle cx="32" cy="32" r="32" fill={bg} fillOpacity="0.08" />
        <path
          d="M30.889 14.7422C31.5616 14.2929 32.4384 14.2929 33.111 14.7422L34.4718 15.6512C34.9128 15.9458 35.4526 16.0532 35.9727 15.9498L37.5779 15.6307C38.3711 15.473 39.1813 15.8086 39.6307 16.481L40.5401 17.8416C40.8347 18.2825 41.2924 18.5883 41.8125 18.6918L43.4176 19.0113C44.2108 19.1692 44.8308 19.7892 44.9887 20.5824L45.3082 22.1875C45.4117 22.7076 45.7175 23.1653 46.1584 23.4599L47.519 24.3693C48.1914 24.8187 48.527 25.6289 48.3693 26.4221L48.0502 28.0272C47.9468 28.5474 48.0542 29.0872 48.3488 29.5282L49.2578 30.889C49.7071 31.5616 49.7071 32.4384 49.2578 33.111L48.3488 34.4718C48.0542 34.9128 47.9468 35.4526 48.0502 35.9727L48.3693 37.5779C48.527 38.3711 48.1914 39.1813 47.519 39.6307L46.1584 40.5401C45.7175 40.8347 45.4117 41.2924 45.3082 41.8125L44.9887 43.4176C44.8308 44.2108 44.2108 44.8308 43.4176 44.9887L41.8125 45.3082C41.2924 45.4117 40.8347 45.7175 40.5401 46.1584L39.6307 47.519C39.1813 48.1914 38.3711 48.527 37.5779 48.3693L35.9727 48.0502C35.4526 47.9468 34.9128 48.0542 34.4718 48.3488L33.111 49.2578C32.4384 49.7071 31.5616 49.7071 30.889 49.2578L29.5282 48.3488C29.0872 48.0542 28.5474 47.9468 28.0273 48.0502L26.4221 48.3693C25.6289 48.527 24.8187 48.1914 24.3693 47.519L23.4599 46.1584C23.1653 45.7175 22.7076 45.4117 22.1875 45.3082L20.5824 44.9887C19.7892 44.8308 19.1692 44.2108 19.0113 43.4176L18.6918 41.8125C18.5883 41.2924 18.2825 40.8347 17.8416 40.5401L16.481 39.6307C15.8086 39.1813 15.473 38.3711 15.6307 37.5779L15.9498 35.9728C16.0532 35.4526 15.9458 34.9128 15.6512 34.4718L14.7422 33.111C14.2929 32.4384 14.2929 31.5616 14.7422 30.889L15.6512 29.5282C15.9458 29.0872 16.0532 28.5474 15.9498 28.0273L15.6307 26.4221C15.473 25.6289 15.8086 24.8187 16.481 24.3693L17.8416 23.4599C18.2825 23.1653 18.5883 22.7076 18.6918 22.1875L19.0113 20.5824C19.1692 19.7892 19.7892 19.1692 20.5824 19.0113L22.1875 18.6918C22.7076 18.5883 23.1653 18.2825 23.4599 17.8416L24.3693 16.481C24.8187 15.8086 25.6289 15.473 26.4221 15.6307L28.0272 15.9498C28.5474 16.0532 29.0872 15.9458 29.5282 15.6512L30.889 14.7422Z"
          fill={fill}
        />
        <circle cx="32" cy="15" r="2" fill="#191C1E" />
        <circle cx="6" cy="18" r="2" fill="#191C1E" />
        <circle cx="58" cy="18" r="2" fill="#191C1E" />
        <circle cx="3" cy="32" r="2" fill="#191C1E" />
        <circle cx="61" cy="32" r="2" fill="#191C1E" />
        <circle cx="32" cy="49" r="2" fill="#191C1E" />
        <circle cx="6" cy="46" r="2" fill="#191C1E" />
        <circle cx="58" cy="46" r="2" fill="#191C1E" />
        <circle cx="47" cy="23" r="2" fill="#191C1E" />
        <circle cx="46" cy="8" r="2" fill="#191C1E" />
        <circle cx="48" cy="41" r="2" fill="#191C1E" />
        <circle cx="46" cy="56" r="2" fill="#191C1E" />
        <circle cx="17" cy="23" r="2" fill="#191C1E" />
        <circle cx="18" cy="9" r="2" fill="#191C1E" />
        <circle cx="17" cy="41" r="2" fill="#191C1E" />
        <circle cx="18" cy="56" r="2" fill="#191C1E" />
        <circle cx="32" cy="4" r="2" fill="#191C1E" />
        <circle cx="32" cy="60" r="2" fill="#191C1E" />
        <path
          d="M29.0547 35.7148V38H20.125V36.0664L24.2383 31.7422C24.6016 31.3262 24.8945 30.9541 25.1172 30.626C25.3398 30.292 25.501 29.9902 25.6006 29.7207C25.7061 29.4512 25.7588 29.208 25.7588 28.9912C25.7588 28.6221 25.7031 28.3145 25.5918 28.0684C25.4863 27.8164 25.3281 27.626 25.1172 27.4971C24.9121 27.3682 24.6572 27.3037 24.3525 27.3037C24.0479 27.3037 23.7812 27.3916 23.5527 27.5674C23.3242 27.7432 23.1455 27.9834 23.0166 28.2881C22.8936 28.5928 22.832 28.9355 22.832 29.3164H19.8613C19.8613 28.5312 20.0518 27.8135 20.4326 27.1631C20.8193 26.5127 21.3555 25.9941 22.041 25.6074C22.7266 25.2148 23.5205 25.0186 24.4229 25.0186C25.3662 25.0186 26.1572 25.165 26.7959 25.458C27.4346 25.751 27.915 26.1758 28.2373 26.7324C28.5654 27.2832 28.7295 27.9482 28.7295 28.7275C28.7295 29.1729 28.6592 29.6006 28.5186 30.0107C28.3779 30.4209 28.1758 30.8281 27.9121 31.2324C27.6484 31.6309 27.3262 32.041 26.9453 32.4629C26.5703 32.8848 26.1426 33.333 25.6621 33.8076L24.0098 35.7148H29.0547ZM29.8037 36.6113C29.8037 36.1895 29.9561 35.8379 30.2607 35.5566C30.5654 35.2695 30.958 35.126 31.4385 35.126C31.9248 35.126 32.3174 35.2695 32.6162 35.5566C32.9209 35.8379 33.0732 36.1895 33.0732 36.6113C33.0732 37.0332 32.9209 37.3877 32.6162 37.6748C32.3174 37.9561 31.9248 38.0967 31.4385 38.0967C30.958 38.0967 30.5654 37.9561 30.2607 37.6748C29.9561 37.3877 29.8037 37.0332 29.8037 36.6113ZM36.5469 32.2959L34.1914 31.7422L34.9648 25.2031H42.4443V27.5059H37.3818L37.0918 30.0459C37.2324 29.9639 37.4697 29.8672 37.8037 29.7559C38.1436 29.6387 38.5186 29.5801 38.9287 29.5801C39.5615 29.5801 40.1211 29.6768 40.6074 29.8701C41.0996 30.0576 41.5156 30.3359 41.8555 30.7051C42.1953 31.0684 42.4502 31.5166 42.6201 32.0498C42.7959 32.583 42.8838 33.1924 42.8838 33.8779C42.8838 34.4287 42.793 34.9619 42.6113 35.4775C42.4355 35.9873 42.1631 36.4473 41.7939 36.8574C41.4307 37.2617 40.9707 37.584 40.4141 37.8242C39.8574 38.0586 39.1982 38.1758 38.4365 38.1758C37.8682 38.1758 37.3145 38.0879 36.7754 37.9121C36.2363 37.7363 35.75 37.4844 35.3164 37.1562C34.8887 36.8223 34.5488 36.4209 34.2969 35.9521C34.0508 35.4775 33.9307 34.9473 33.9365 34.3613H36.916C36.9336 34.6719 37.0068 34.9414 37.1357 35.1699C37.2646 35.3984 37.4375 35.5771 37.6543 35.7061C37.877 35.8291 38.1318 35.8906 38.4189 35.8906C38.7119 35.8906 38.9551 35.832 39.1484 35.7148C39.3418 35.5977 39.4941 35.4365 39.6055 35.2314C39.7168 35.0264 39.7959 34.792 39.8428 34.5283C39.8896 34.2588 39.9131 33.9746 39.9131 33.6758C39.9131 33.3594 39.8779 33.0752 39.8076 32.8232C39.7432 32.5713 39.6377 32.3574 39.4912 32.1816C39.3447 32 39.1543 31.8623 38.9199 31.7686C38.6914 31.6748 38.416 31.6279 38.0938 31.6279C37.666 31.6279 37.3291 31.7012 37.083 31.8477C36.8369 31.9941 36.6582 32.1436 36.5469 32.2959Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_56206_16604">
          <rect width="64" height="64" rx="32" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ParticlesIcon;
