import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme, GlobalStyle, ThemeType } from "./styles";
import { ToastProvider } from "./components/feedback/ToastProvider";
import { getTranslate } from "./locales/I18n";
import { DeepPartial, mergeTheme } from "./utils/ThemeUtils";

interface ConfigContextState {
  locale: string;
  mode: "dark" | "light";
  t: (key: string, variables?: Record<string, any>) => any;
}
const ConfigContext = createContext<ConfigContextState>({
  locale: "en",
  mode: "dark",
  t: getTranslate("en"),
});

export interface ConfigProviderProps {
  locale?: string;
  mode?: "dark" | "light";
  withGlobalStyles?: boolean;
  withToast?: boolean;
  themeOverride?: DeepPartial<ThemeType>;
  children: React.ReactNode;
}

export const ConfigProvider = ({
  locale = "en",
  mode = "dark",
  withGlobalStyles = true,
  withToast = true,
  themeOverride,
  children,
}: ConfigProviderProps) => {
  const t = useMemo(() => getTranslate(locale), [locale]);
  const baseTheme = mode === "dark" ? darkTheme : lightTheme;
  const activeTheme = useMemo(
    () => mergeTheme(baseTheme, themeOverride),
    [baseTheme, themeOverride],
  );

  const contextValue = useMemo(() => ({ locale, mode, t }), [locale, mode, t]);
  return (
    <ConfigContext.Provider value={contextValue}>
      <ThemeProvider theme={activeTheme}>
        {withGlobalStyles && <GlobalStyle />}
        {withToast && <ToastProvider />}
        {children}
      </ThemeProvider>
    </ConfigContext.Provider>
  );
};
export const useUiConfig = () => useContext(ConfigContext);
