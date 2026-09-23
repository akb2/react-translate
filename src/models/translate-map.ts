import { EnumValues, MultiObject } from "@akb2/types-tools";
import { Language } from "./language";

export type TranslateMap<
  MainLanguage extends Language = Language.English,
  Languages extends Exclude<Language, MainLanguage> = Exclude<Language, MainLanguage>,
> = MultiObject<
  { [K in EnumValues<MainLanguage>]: string } & { [K in EnumValues<Languages>]?: string }
>;
