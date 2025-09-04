"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hook/redux-hook";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/lib/store/reducer/settings";
import i18n from "@/lib/utils/i18n";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
];

const LanguageSettingPage = () => {
  const selectedLanguage = useAppSelector((s) => s.setting.language ?? "bn");
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    dispatch(setLanguage(code));    
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">{t("selectLanguage")}</h1>
      <div className="space-y-3">
        {languages.map((lang) => (
          <Card
            tabIndex={0}
            key={lang.code}
            role="button"
            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 ${
              selectedLanguage === lang.code ? "bg-blue-50" : ""
            }`}
            onClick={() => handleSelectLanguage(lang.code)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleSelectLanguage(lang.code);
              }
            }}
          >
            <div className="flex justify-between items-center w-full">

            <div>
              <p className="font-semibold">{t(lang.name.toLowerCase())}</p>
              <p className="text-gray-600 text-sm">{lang.nativeName}</p>
            </div>
            {selectedLanguage === lang.code && (
                <span className="text-blue-600 font-bold">✓</span>
            )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettingPage;
