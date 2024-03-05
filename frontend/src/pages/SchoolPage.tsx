import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import WidgetSection from "@/components/WidgetSection";
import Widget from "@/components/widget";

import { getSchoolPage } from "@/api/school";
import { SchoolDashboard } from "@/types/school";
import EmptyDashboard from "@/components/EmptyDashboard";
import IconButton from "@/components/IconButton";
import PageNotFound from "./PageNotFound";

const SchoolPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  document.documentElement.style.setProperty("--body-bg-color", "#BEE6FA");
  const { sectionId, pageId, schoolId } = useParams<{
    pageId: string;
    sectionId: string;
    schoolId: string;
  }>();

  const { data, isLoading, error } = useQuery<SchoolDashboard>({
    queryKey: ["schoolPage", sectionId, pageId],
    queryFn: () =>
      getSchoolPage({
        pageId,
        sectionId
      }),
    retry: false
  });

  const widgets = data?.widgets.sort((a, b) => a.sn - b.sn);
  const handleBack = () => navigate(`/${schoolId}`);

  if (error) {
    document.documentElement.style.setProperty("--body-bg-color", "#E5F9E1");
    return <PageNotFound />;
  }

  return (
    <main className="pt-[56px] sm:pt-[72px] ">
      <div className="p-4 pb-0">
        <div className="mx-auto pt-6 sm:pt-10 xl:min-w-[960px] xl:px-[120px] 2xl:min-w-[1360px]">
          <IconButton
            icon="back"
            variant="greyTransparent"
            className="mb-2"
            a11y={t("a11y.buttons.go_back")}
            onClick={handleBack}
          />
          <h1 className="text-[32px] font-semibold sm:text-[36px]">
            {data?.name}
          </h1>
        </div>
      </div>
      {widgets && !isLoading ? (
        <WidgetSection>
          {widgets?.map((widget) => (
            <Widget
              key={widget.id}
              id={widget.id}
              widgetType={widget.data_source_key}
            />
          ))}
        </WidgetSection>
      ) : (
        !isLoading && <EmptyDashboard />
      )}
    </main>
  );
};

export default SchoolPage;
