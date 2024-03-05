import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { m, LazyMotion, domAnimation } from "framer-motion";

import useMediaQuery from "@mui/material/useMediaQuery";

import WidgetSection from "@/components/WidgetSection";
import Widget from "@/components/widget";
import QuickLink from "@/components/quickLink";
import EmptyDashboard from "@/components/EmptyDashboard";

import { getSchoolDashboard, getSchoolOverview } from "@/api/school";
import { School, SchoolDashboard, SchoolOverview } from "@/types/school";

const SchoolHome = () => {
  const [t] = useTranslation();
  const matches = useMediaQuery("(max-width:640px)");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  document.documentElement.style.setProperty("--body-bg-color", "#E5F9E1");

  const { schoolId } = useParams<{ schoolId: string }>();
  const outletSchool = useOutletContext<School>();

  const { data: dataOverview, isLoading: isLoadingOverview } =
    useQuery<SchoolOverview>({
      queryKey: ["schoolOverview", schoolId],
      queryFn: () =>
        getSchoolOverview({
          schoolId
        }),
      refetchInterval: 1000 * 60 * 15, // 15 minutes
      keepPreviousData: true
    });

  const { data, isLoading } = useQuery<SchoolDashboard>({
    queryKey: ["schoolDashboard", schoolId],
    queryFn: () =>
      getSchoolDashboard({
        schoolId
      })
  });

  const pages = data?.sections
    .filter((item) => item.link)
    .sort((a, b) => a.sn - b.sn);
  const sections = data?.sections
    .filter((item) => !item.link && item.active)
    .sort((a, b) => a.sn - b.sn);
  const widgets = data?.widgets;

  const quickLinks = dataOverview?.sections
    .sort((a, b) => a.sn - b.sn)
    .map((item) => {
      return item.widgets
        .filter((item) => item.active)
        .sort((a, b) => a.sn - b.sn);
    })
    .flat();

  const onQuickLinkClick = (id: string) => {
    const el = document.getElementById(id);
    const { y } = el?.getBoundingClientRect() || { y: 0 };
    scrollTo({ top: window.scrollY + y - 120, behavior: "smooth" });
  };

  return (
    <main className="pt-[88px]">
      <LazyMotion features={domAnimation}>
        {matches && outletSchool && (
          <div className="mb-4 ml-4 inline-block rounded-full bg-white px-6 py-2.5">
            {outletSchool.logo_url ? (
              <img
                className="max-h-8 "
                src={outletSchool?.logo_url}
                alt={`${outletSchool?.name} ${t("a11y.logo")}`}
              />
            ) : (
              <span className="text-lg font-medium">{outletSchool?.name}</span>
            )}
          </div>
        )}

        {pages && (
          <div className="mx-auto p-4 pb-4 xl:min-w-[960px] xl:px-[120px] 2xl:min-w-[1360px]">
            <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
              {pages?.map((item) => (
                <Link
                  key={item.id}
                  className="shrink-0 rounded-24 bg-white p-4 text-lg font-semibold outline-none ring-inset ring-blue-500 transition-all focus-visible:ring-2 sm:basis-[calc(50%-16px)] md:basis-[calc(33.3%-16px)] lg:basis-[calc(25%-16px)]"
                  to={`page/${data?.id}/sections/${item.id}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {quickLinks && (
          <m.div className="mx-auto grid auto-rows-max gap-4 p-4 pb-8 sm:grid-cols-2 lg:grid-cols-3 xl:min-w-[960px] xl:px-[120px] 2xl:min-w-[1360px] 2xl:grid-cols-4">
            {!isLoadingOverview &&
              quickLinks.map((item, index) => (
                <m.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.04 }}
                  key={item.id}
                  onClick={() =>
                    item.data_source_key === "footprint_calculator"
                      ? window.open(item.data_source_url, "_blank")
                      : onQuickLinkClick(`${item.id}-${item.data_source_key}`)
                  }
                  className="rounded-32 text-left ring-inset ring-blue-500 focus-visible:ring-2"
                >
                  <QuickLink
                    widgetType={item.data_source_key}
                    latestData={item.latest_data}
                    currentData={item.current_data}
                  />
                </m.button>
              ))}
          </m.div>
        )}

        {(sections || widgets) && !isLoading ? (
          <>
            {sections?.map((section) =>
              section.widgets.length ? (
                <WidgetSection
                  key={section.id}
                  title={section.name}
                  variant={section.theme}
                  layout="section"
                >
                  {section.widgets.map(
                    (widget) =>
                      widget.active && (
                        <Widget
                          key={widget.id}
                          id={widget.id}
                          widgetType={widget.data_source_key}
                        />
                      )
                  )}
                </WidgetSection>
              ) : null
            )}
          </>
        ) : (
          !isLoading && <EmptyDashboard />
        )}
      </LazyMotion>
    </main>
  );
};

export default SchoolHome;
