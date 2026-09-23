import { anyToString, isDefined } from "@akb2/types-tools";

export const replaceTemplatedValues = <T extends object>(
  str: string,
  templatedValues?: T,
): string => {
  if (!templatedValues) {
    return str;
  }

  const matches = str.match(/\{\{([A-z]{1}[A-z0-9_\-]+)\}\}/g);

  if (!matches) {
    return str;
  }

  let result = str;

  for (const match of matches) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const key = match.slice(2, -2);
    const value = anyToString((templatedValues as Record<string, unknown>)[key]);

    if (isDefined(value)) {
      result = result.replace(match, value);
    }
  }

  return result;
};
