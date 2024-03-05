import { FC, useContext, useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import useMediaQuery from "@mui/material/useMediaQuery";

import { AppContext } from "@/context/AppContext";
import Modal from "@/components/Modal";

import { login } from "@/api/auth";
import { decodeJwtResponse } from "@/utils/googleAuth";
import { setCookie } from "@/utils/cookieProvider";

const LogInButton: FC = () => {
  const [t] = useTranslation();
  const matches = useMediaQuery("(min-width:640px)");

  const { dispatch } = useContext(AppContext);

  const { mutate } = useMutation({
    mutationFn: login
  });

  const [showError, setShowError] = useState(false);

  const toggleModal = () => setShowError(!showError);

  const handleGoogleLogin = (credentialResponse: CredentialResponse) => {
    const userData = decodeJwtResponse(credentialResponse.credential);

    mutate(
      {
        email: userData.email,
        name: userData.name
      },
      {
        onSuccess: (res) => {
          const days = 10;
          const date = days * 3600 * 24;

          setCookie("antiloop_token", res.access_token, {
            path: "/",
            expires: date
          });
          dispatch({
            type: "LOGIN",
            payload: res
          });
          document.location.href = `/${res.school.id}`;
        },
        onError: () => toggleModal()
      }
    );
  };

  return (
    <>
      <GoogleLogin
        ux_mode="popup"
        type={matches ? "standard" : "icon"}
        shape="circle"
        onSuccess={handleGoogleLogin}
        onError={() => {
          toggleModal();
        }}
      />
      <Modal
        open={showError}
        action={toggleModal}
        actionTitle={t("ok")}
        toggleModal={toggleModal}
        title={t("no_account")}
        testId="login-error-modal"
      >
        <p className="sm:max-w-[320px]">
          {t("no_account_msg")}
          <a
            className="text-blue-500 underline"
            target="_blank"
            href="https://innovation.helsingborg.se/initiativ/antiloop-iot-baserad-klimatdata-i-klassrummen/"
          >
            {t("contact_us")}
          </a>
        </p>
      </Modal>
    </>
  );
};

export default LogInButton;
