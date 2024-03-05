import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "@/assets/locales/en.json";
import translationSV from "@/assets/locales/sv-SE/sv.json";

const resources = {
  en: {
    translation: translationEN
  },
  sv: {
    translation: translationSV
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("antiloop_locale") || "sv",

  interpolation: {
    escapeValue: false
  },

  react: {
    bindI18n: "languageChanged"
  }
});

export default i18n;
