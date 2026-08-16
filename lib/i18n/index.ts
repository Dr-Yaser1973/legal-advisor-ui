// lib/i18n/index.ts
// نقطة الدخول الموحّدة. آمنة للاستيراد من الخادم والعميل معاً
// (لا تستورد next/headers — لذلك استخدم lib/i18n/server للقراءة على الخادم).

export * from "./config";

import type { Locale } from "./config";
import { common, type CommonDict } from "./dictionaries/common";
import { home, type HomeDict } from "./dictionaries/home";

export type { CommonDict, HomeDict };

export type Dictionary = {
  common: CommonDict;
  home: HomeDict;
};

export function getDictionary(locale: Locale): Dictionary {
  return {
    common: common[locale],
    home: home[locale],
  };
}

export function getCommon(locale: Locale): CommonDict {
  return common[locale];
}

export function getHome(locale: Locale): HomeDict {
  return home[locale];
}
