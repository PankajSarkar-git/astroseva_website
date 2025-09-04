import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/lib/locales/en.json";
import hi from "@/lib/locales/hi.json";
import bn from "@/lib/locales/bn.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
  },
  lng: "en", // default
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
