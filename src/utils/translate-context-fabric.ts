import { useLocalStorageState } from "@akb2/react-use-local-storage";
import { anyToArray, anyToString, mergeAndFlatObjects, smartJoin } from "@akb2/types-tools";
import { TRANSLATE_CONTEXT_KEY } from "@data/translate_context_key";
import { TRANSLATE_LOCAL_STORAGE_KEY } from "@data/translate_local_storage_key";
import { CreateTranslateContext } from "@models/create-translate-context";
import { Language } from "@models/language";
import { TranslateContextProps } from "@models/translate-context-props";
import { TranslateHookProps } from "@models/translate-hook-props";
import { TranslateMap } from "@models/translate-map";
import { TranslateProviderProps } from "@models/translate-provider-props";
import { getGlobalContext } from "@utils/get-global-context";
import { hasTranslates } from "@utils/has-translates";
import { createElement, FC, useCallback, useContext, useLayoutEffect, useState } from "react";
import { replaceTemplatedValues } from "./replace-templated-values";

export const translateContextFabric = (): CreateTranslateContext => {
  const TranslateContext = getGlobalContext<TranslateContextProps>(TRANSLATE_CONTEXT_KEY);

  const TranslateProvider: FC<TranslateProviderProps> = ({
    children,
    initialTranslates,
    defaultLanguage,
  }) => {
    const [translates, setTranslates] = useState(
      mergeAndFlatObjects(...anyToArray(initialTranslates)),
    );

    const addTranslates = useCallback(
      (...newTranslates: TranslateMap[]) => {
        if (hasTranslates(newTranslates)) {
          setTranslates((prevTranslates) => mergeAndFlatObjects(prevTranslates, ...newTranslates));
        }
      },
      [setTranslates],
    );

    return createElement(TranslateContext.Provider, {
      value: { translates, addTranslates, defaultLanguage },
      children,
    });
  };

  const useTranslate = (...localTranslates: TranslateMap[]): TranslateHookProps => {
    const context = useContext(TranslateContext);

    if (!context) {
      throw new Error("useTranslate must be used within a TranslateProvider");
    }

    const { defaultLanguage, translates, addTranslates } = context;
    const [language, setLanguage] = useLocalStorageState<Language>(
      TRANSLATE_LOCAL_STORAGE_KEY,
      defaultLanguage,
    );

    const translate = useCallback(
      <T extends object>(keyPath: string, templatedValues?: T): string => {
        const key = smartJoin(".", keyPath, language ?? defaultLanguage);
        const translation = anyToString(translates[key]);

        return Boolean(translation)
          ? replaceTemplatedValues(translation, templatedValues)
          : keyPath;
      },
      [translates, language, defaultLanguage],
    );

    useLayoutEffect(() => {
      if (hasTranslates(localTranslates)) {
        addTranslates(...localTranslates);
      }
    }, []);

    return { translate, language, setLanguage, defaultLanguage };
  };

  return { TranslateContext, TranslateProvider, useTranslate };
};
