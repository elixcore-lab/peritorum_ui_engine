import { css, type Theme } from "@emotion/react";

export const componentBorder = (theme: Theme, color: string) => css`
  border: ${theme.sizes.component.dividerThin} solid ${color};
`;

export const transparentBorder = (theme: Theme) =>
  componentBorder(theme, theme.colors.utility.transparent);

export const controlBorder = (theme: Theme, isError?: boolean) =>
  componentBorder(
    theme,
    isError ? theme.colors.status.danger : theme.colors.border.strong,
  );

export const controlDisabledStyle = (theme: Theme) => css`
  opacity: 0.5;
  cursor: not-allowed;
  background-color: ${theme.colors.surface.sunken};
`;

export const squareIconSize = (
  theme: Theme,
  size: keyof Theme["sizes"]["icon"],
) => css`
  width: ${theme.sizes.icon[size]};
  height: ${theme.sizes.icon[size]};
`;

export const squareComponentSize = (
  theme: Theme,
  size: keyof Theme["sizes"]["control"],
) => css`
  width: ${theme.sizes.control[size]};
  height: ${theme.sizes.control[size]};
`;
