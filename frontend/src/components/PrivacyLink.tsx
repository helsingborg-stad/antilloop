import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PrivacyLink: FC = () => {
  const [t] = useTranslation();
  return (
    <footer className="mt-auto flex justify-center py-4">
      <Link
        className="underline transition-all hover:text-blue-500"
        to="/privacy-policy"
      >
        {t("privacy_policy.link")}
      </Link>
    </footer>
  );
};

export default PrivacyLink;
