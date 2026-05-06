import en from "./en.json";
import ko from "./ko.json";

const dictionaries: Record<string, any> = { en, ko };

export const getTranslate = (localeStr: string = "en") => {
  const baseLocale = localeStr.startsWith("ko") ? "ko" : "en";
  const dict = dictionaries[baseLocale] || dictionaries.en;

  return (key: string, variables?: Record<string, any>): any => {
    const keys = key.split(".");
    let value = dict;
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    if (value === undefined) return key;

    if (typeof value === "string" && variables) {
      return value.replace(/{{(.*?)}}/g, (match, p1) => {
        const varName = p1.trim();
        return variables[varName] !== undefined
          ? String(variables[varName])
          : match;
      });
    }
    return value;
  };
};
