import type { TranslateMap } from "@models/translate-map";

export const hasTranslates = (translates: TranslateMap[]): boolean =>
  translates.length > 0 && translates.some((translate) => Object.keys(translate).length > 0);
