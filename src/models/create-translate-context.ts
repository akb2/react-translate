import { Nullable } from "@akb2/types-tools";
import { TranslateContextProps } from "@models/translate-context-props";
import { TranslateHookProps } from "@models/translate-hook-props";
import { TranslateMap } from "@models/translate-map";
import { TranslateProviderProps } from "@models/translate-provider-props";
import { Context, FC } from "react";

export interface CreateTranslateContext {
  TranslateContext: Context<Nullable<TranslateContextProps>>;
  TranslateProvider: FC<TranslateProviderProps>;
  useTranslate: {
    (): TranslateHookProps;
    (...translates: TranslateMap[]): TranslateHookProps;
  };
}
