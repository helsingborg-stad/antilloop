import { Link } from "react-router-dom";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import PrivacyLink from "@/components/PrivacyLink";

import { School } from "@/types/school";
import { getSchools } from "@/api/school";

const Home = () => {
  const [t] = useTranslation();

  const { data, isLoading } = useQuery<School[]>({
    queryKey: ["schools"],
    queryFn: getSchools
  });

  if (isLoading) return null;

  return (
    <main className="mx-auto min-h-screen w-full bg-lime-100  bg-[url('@/assets/background.svg')] bg-contain bg-center bg-repeat-y">
      <div className="mx-auto flex min-h-full flex-wrap items-center justify-center px-1 pb-4 pt-[72px] md:pt-[100px] lg:max-w-[1200px] 2xl:max-w-[1600px] [&>*:nth-child(5n+1)]:md:basis-1/3 [&>*:nth-child(5n+2)]:md:basis-1/3 [&>*:nth-child(5n+3)]:md:basis-1/3 [&>*:nth-child(7n+1)]:2xl:basis-1/4 [&>*:nth-child(7n+2)]:2xl:basis-1/4 [&>*:nth-child(7n+3)]:2xl:basis-1/4 [&>*:nth-child(7n+4)]:2xl:basis-1/4">
        <LazyMotion features={domAnimation}>
          {data?.map((school) => (
            <div
              key={school.id}
              className="flex basis-1/2 items-center justify-center p-1 sm:p-2 2xl:basis-1/3"
            >
              <m.div
                initial={{
                  rotate: 0,
                  marginBottom: 0
                }}
                whileHover={{
                  rotate: -6,
                  marginBottom: 20
                }}
              >
                <Link
                  style={{ background: school.main_color }}
                  className="flex rounded-36 border-[8px] border-borderSchool bg-white p-4 ring-blue-500 transition-all focus-visible:ring-2 sm:rounded-64 sm:border-[12px] sm:p-8 lg:rounded-80 lg:border-[16px] lg:p-10"
                  to={`${school.id}`}
                >
                  {school.logo_url ? (
                    <img
                      className="aspect-auto max-h-[25vw] sm:max-h-[20vw] md:max-h-[16vw] md:max-w-[150px] lg:max-w-[210px] xl:max-w-[256px]"
                      src={school.logo_url}
                      alt={`${school.name} ${t("a11y.logo")}`}
                    />
                  ) : (
                    <span className="max-h-[25vw] text-center text-sm font-bold sm:max-h-[20vw] sm:text-base md:max-h-[16vw] md:max-w-[150px] lg:max-w-[210px] lg:text-lg xl:max-w-[256px] xl:text-2xl">
                      {school.name}
                    </span>
                  )}
                </Link>
              </m.div>
            </div>
          ))}

          <div className="mb-4 flex !basis-full justify-center p-1 sm:p-2 md:p-6">
            <m.div
              initial={{
                rotate: 0,
                marginBottom: 0
              }}
              whileHover={{
                rotate: -6,
                marginBottom: 20
              }}
              className="origin-top-right rounded-[120px] border-[8px] border-white bg-lime-300 p-4 sm:border-[12px] lg:border-[16px]"
            >
              <a
                href="https://innovation.helsingborg.se/initiativ/antiloop-iot-baserad-klimatdata-i-klassrummen/"
                target="_blank"
                className="block max-w-[128px] text-center text-xs font-bold tracking-wide sm:max-w-[180px] sm:text-base md:max-w-[220px] md:text-xl"
              >
                {t("add_your_school")}
              </a>
            </m.div>
          </div>
        </LazyMotion>
      </div>
      <PrivacyLink />
    </main>
  );
};

export default Home;
