// import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getSchoolSettings } from "@/api/school";
import SchoolSettingsForm from "@/components/workspace/SchoolSettingsForm";

import { SchoolSettingsI } from "@/types/school";

const SchoolSettings = () => {
  const [t] = useTranslation();

  const { schoolId } = useParams<{ schoolId: string }>();

  const { data } = useQuery<SchoolSettingsI>({
    queryKey: ["schoolSettings", schoolId],
    queryFn: () => getSchoolSettings({ schoolId })
  });

  if (!data) return null;

  return (
    <main className="flex flex-col gap-6 overflow-hidden rounded-2xl bg-white p-4 lg:max-h-[calc(100vh-104px)]">
      <h1 className="text-[22px] font-medium">{t("school_settings")}</h1>
      <div className="no-scrollbar flex-grow overflow-auto">
        <SchoolSettingsForm data={data} />
      </div>
    </main>
  );
};

export default SchoolSettings;
