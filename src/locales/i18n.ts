import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const Languages: string[] = ["uz", "ru", "en"];

const initOptions: InitOptions = {
  fallbackLng: "en",
  debug: false,
  supportedLngs: Languages,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["cookie", "localStorage"],
    lookupCookie: "lang",
    lookupLocalStorage: "lang",

    caches: ["cookie", "localStorage"],
  },
  backend: {
    loadPath: "../locales/{{lng}}/translation.json",
  },
};

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init(initOptions);

export default i18n;
