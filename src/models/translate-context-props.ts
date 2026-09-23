import { Language } from "@models/language";
import { TranslateMap } from "@models/translate-map";

export interface TranslateContextProps {
  translates: TranslateMap;
  defaultLanguage: Language;
  addTranslates: (...translateMap: TranslateMap[]) => void;
}
