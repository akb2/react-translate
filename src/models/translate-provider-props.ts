import { TranslateMap } from "@models/translate-map";
import { PropsWithChildren } from "react";
import { TranslateContextProps } from "./translate-context-props";

export interface TranslateProviderProps
  extends PropsWithChildren, Pick<TranslateContextProps, "defaultLanguage"> {
  initialTranslates?: TranslateMap[];
}
