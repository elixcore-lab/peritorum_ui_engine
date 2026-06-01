import { Global, css, type Theme } from "@emotion/react";
import { applyTransition, customScrollbar } from "./mixins";

const style = (theme: Theme) => css`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    font-size: ${theme.fontSizes.sm};
    width: 100%;
    height: 100%;
  }

  body {
    background-color: ${theme.colors.background.page};
    color: ${theme.colors.text.primary};
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      system-ui,
      Roboto,
      sans-serif;

    ${applyTransition(
      theme,
      "background-color, color",
      theme.transitions.duration.normal,
      theme.transitions.function.easeInOut,
    )}

    -webkit-font-smoothing: antialiased;

    ${customScrollbar(theme)}
  }

  * {
    box-sizing: border-box;
  }

  ::selection {
    background: ${theme.colors.brand.cyan};
    color: ${theme.colors.background.page};
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button,
  input,
  textarea,
  select {
    font-family: inherit;
  }
`;

export const GlobalStyle = () => {
  return <Global styles={style} />;
};
