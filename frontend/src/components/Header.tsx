import { FC, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "@/context/AppContext";
import { useTranslation } from "react-i18next";

import useMediaQuery from "@mui/material/useMediaQuery";

import Icon from "@/components/Icon";
import IconButton from "@/components/IconButton";
import LogInButton from "@/components/LogInButton";
import UserMenu from "@/components/UserMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";

import { me } from "@/api/auth";
import { getCookieByName } from "@/utils/cookieProvider";
import { School } from "@/types/school";

interface HeaderProps {
  admin?: boolean;
  home?: boolean;
  typography?: boolean;
  school?: School;
}

const Header: FC<HeaderProps> = ({ admin, home, school, typography }) => {
  const [t] = useTranslation();
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const matches = useMediaQuery("(min-width:640px)");

  const isLoggedIn = getCookieByName("antiloop_token");
  const user = state.currentUser;

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: me,
    enabled: !user && !typography && !!isLoggedIn
  });

  const handleSchoolList = () => navigate("/");
  const handleSchool = () =>
    navigate(user ? `/${user?.school.id}` : school ? `/${school.id}` : "");

  useEffect(() => {
    data && dispatch({ type: "LOGIN", payload: data });
  }, [data, dispatch]);

  return (
    <header
      className={`mui-fixed fixed top-0 z-50 flex h-14 w-full items-center gap-3 px-4 py-3 sm:h-18 sm:bg-transparent  ${
        admin ? "bg-white sm:bg-white" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {home && (
          <Icon className="h-12 w-12 sm:h-14 sm:w-14" name="helsinborg" />
        )}
        {!!user && admin && (
          <>
            {matches ? (
              <Link
                className={`p-2 ring-blue-500 transition-all focus-visible:ring-2 ${
                  !matches
                    ? `rounded-full ${
                        admin ? "bg-grey-100" : "bg-white shadow-material-s"
                      }`
                    : ""
                }`}
                to={`/${user.school.id}`}
              >
                {user.school.logo_url ? (
                  <img
                    className="max-h-8"
                    src={user.school.logo_url}
                    alt={`${user.school.name} ${t("a11y.logo")}`}
                  />
                ) : (
                  <span className="text-lg font-medium">
                    {user.school.name}
                  </span>
                )}
              </Link>
            ) : (
              <IconButton
                variant={admin ? "grey" : "white"}
                icon="home"
                onClick={handleSchool}
                a11y={t("a11y.buttons.to_school_list")}
              />
            )}
          </>
        )}
        {school && (
          <>
            {matches ? (
              <Link
                className={`rounded-32 bg-white px-6 py-3 shadow-material-s ring-blue-500 transition-all focus-visible:ring-2 ${
                  !matches ? "rounded-full  bg-white shadow-material-s" : ""
                }`}
                to={`/${school.id}`}
              >
                {school.logo_url ? (
                  <img
                    className="max-h-8"
                    src={school.logo_url}
                    alt={`${school.name} ${t("a11y.logo")}`}
                  />
                ) : (
                  <span className="text-lg font-medium">{school.name}</span>
                )}
              </Link>
            ) : (
              <IconButton
                variant={admin ? "grey" : "white"}
                icon="home"
                onClick={handleSchool}
                a11y={t("a11y.buttons.to_school_list")}
              />
            )}
          </>
        )}
        {!home && (
          <IconButton
            variant={admin ? "grey" : "white"}
            icon="apps"
            onClick={handleSchoolList}
            a11y={t("a11y.buttons.to_school")}
          />
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher admin={admin} />
        {isLoggedIn ? <UserMenu admin={admin} /> : <LogInButton />}
      </div>
    </header>
  );
};

export default Header;
