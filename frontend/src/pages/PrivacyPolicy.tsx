import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

import IconButton from "@/components/IconButton";
import { Helmet } from "react-helmet-async";

const SchoolPage = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => navigate(-1);

  const email = "kontaktcenter@helsingborg.se";

  return (
    <>
      <Helmet>
        <title>{t("privacy_policy.link")} | Antiloop</title>
      </Helmet>
      <main className="pt-[56px] sm:pt-[72px] ">
        <div className="p-4">
          <div className="mx-auto mb-8 max-w-[800px] pt-4">
            <IconButton
              icon="back"
              variant="greyTransparent"
              className="mb-2"
              a11y={t("a11y.buttons.go_back")}
              onClick={handleBack}
            />
            <h1 className="text-[32px] font-semibold sm:text-[36px]">
              {t("privacy_policy.title")}
            </h1>
            <p>{t("privacy_policy.updated", { date: "21.08.2023" })}</p>
          </div>
          <div className="mx-auto max-w-[800px]">
            <article>
              <section className="mb-6">
                <p>{t("privacy_policy.intro")}</p>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.information_collect.title")}
                </h2>
                <ul className="ml-6 list-disc">
                  <li className="mb-2">
                    <h3 className="inline-block font-bold">
                      {t("privacy_policy.information_collect.user_title")}
                    </h3>
                    <span className="ml-1">
                      {t("privacy_policy.information_collect.user")}
                    </span>
                  </li>
                  <li className="mb-2">
                    <h3 className="inline-block font-bold">
                      {t("privacy_policy.information_collect.sensors_title")}
                    </h3>
                    <span className="ml-1">
                      {t("privacy_policy.information_collect.sensors")}
                    </span>
                  </li>
                  <li className="mb-2">
                    <h3 className="inline-block font-bold">
                      {t("privacy_policy.information_collect.cookies_title")}
                    </h3>
                    <span className="ml-1">
                      {t("privacy_policy.information_collect.cookies")}
                    </span>
                  </li>
                </ul>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.information_use.title")}
                </h2>
                <ul className="ml-6 list-disc">
                  <li className="mb-2">
                    <h3 className="inline-block font-bold">
                      {t("privacy_policy.information_use.identification_title")}
                    </h3>
                    <span className="ml-1">
                      {t("privacy_policy.information_use.identification")}
                    </span>
                  </li>
                  <li className="mb-2">
                    <h3 className="inline-block font-bold">
                      {t("privacy_policy.information_use.display_title")}
                    </h3>
                    <span className="ml-1">
                      {t("privacy_policy.information_use.display")}
                    </span>
                  </li>
                </ul>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.legal_basis_processing_title")}
                </h2>
                <p>{t("privacy_policy.legal_basis_processing")}</p>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.data_retention_title")}
                </h2>
                <p>{t("privacy_policy.data_retention")}</p>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.data_security_title")}
                </h2>
                <p>{t("privacy_policy.data_security")}</p>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.your_rights_title")}
                </h2>
                <p>
                  <Trans
                    i18nKey="privacy_policy.your_rights"
                    t={t}
                    values={{ email }}
                    components={[
                      <a
                        className="text-blue-500 underline"
                        href={`mailto:${email}`}
                        target="_blank"
                      />
                    ]}
                  />
                </p>
              </section>
              <section className="mb-6">
                <h2 className="mb-4 text-xl font-medium">
                  {t("privacy_policy.changes_title")}
                </h2>
                <p>{t("privacy_policy.changes")}</p>
              </section>
              <section className="mb-6">
                <p>{t("privacy_policy.end")}</p>
              </section>
            </article>
          </div>
        </div>
      </main>
    </>
  );
};

export default SchoolPage;
