import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import Header from "@/components/Header";

import { getSchool } from "@/api/school";
import { School } from "@/types/school";
import { Helmet } from "react-helmet-async";
import PrivacyLink from "../PrivacyLink";
import PageNotFound from "@/pages/PageNotFound";

const PageLayout = () => {
  const { schoolId } = useParams<{ schoolId: string }>();

  const { data, error } = useQuery<School>({
    queryKey: ["school", schoolId],
    queryFn: () =>
      getSchool({
        schoolId
      }),
    retry: false
  });

  return (
    <>
      <Helmet>
        <title>{data?.name ? `${data.name} | Antiloop` : "Antiloop"}</title>
      </Helmet>
      <div className="flex min-h-screen flex-col">
        <Header school={data} />
        <div className="w-full">
          {data ? <Outlet /> : null}
          {error ? <PageNotFound /> : null}
        </div>
        <PrivacyLink />
      </div>
    </>
  );
};

export default PageLayout;
