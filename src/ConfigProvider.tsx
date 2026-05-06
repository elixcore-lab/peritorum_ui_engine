import React, { createContext, useContext, useMemo } from "react";
import { ThemeProvider } from "@emotion/react";
import { darkTheme, lightTheme, GlobalStyle } from "./styles";
import { ToastProvider } from "./components/feedback/ToastProvider";
import { getTranslate } from "./locales/I18n";

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
  children: React.ReactNode;
}

export const ConfigProvider = ({
  locale = "en",
  mode = "dark",
  withGlobalStyles = true,
  withToast = true,
  children,
}: ConfigProviderProps) => {
  const t = useMemo(() => getTranslate(locale), [locale]);
  const activeTheme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode],
  );
  return (
    <ConfigContext.Provider value={{ locale, mode, t }}>
      <ThemeProvider theme={activeTheme}>
        {withGlobalStyles && <GlobalStyle />}
        {withToast && <ToastProvider />}
        {children}
      </ThemeProvider>
    </ConfigContext.Provider>
  );
};
export const useUiConfig = () => useContext(ConfigContext);
