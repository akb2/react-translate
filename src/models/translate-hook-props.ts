import { NotDefinable } from "@akb2/types-tools";
import { Language } from "@models/language";
import { TranslateContextProps } from "@models/translate-context-props";

export interface TranslateHookProps extends Pick<TranslateContextProps, "defaultLanguage"> {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (
    key: string,
    params?: { [key: string | number | symbol]: NotDefinable<string | number | boolean> },
  ) => string;
}
