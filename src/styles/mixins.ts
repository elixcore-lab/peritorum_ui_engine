import { css, Keyframes, type Theme } from "@emotion/react";
import {
  ControlSize,
  ColorVariant,
  AppearanceVariant,
  IconSize,
  FontSize,
} from "./types";
import { slideDownAndFade } from "./animation";

// ==========================================
// 1. Layout & Resets
// ==========================================

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const absoluteCenter = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const absoluteCoverCenter = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const fixedCover = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const resetButton = css`
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
`;

export const resetList = css`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ==========================================
// 2. Typography & Scroll
// ==========================================

export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const customScrollbar = (theme: Theme) => css`
  scrollbar-width: thin;
  scrollbar-color: ${theme.colors.background.scrollbar} transparent;

  &::-webkit-scrollbar {
    width: ${theme.spacing.sm};
    height: ${theme.spacing.sm};
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.background.scrollbar};
    border-radius: ${theme.borderRadius.sm};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.background.scrollbarHover};
  }
`;

export const textGradientStyle = (gradientString: string) => css`
  background: ${gradientString};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
`;

// ==========================================
// 3. Animation & Transition
// ==========================================

export const applyAnimation = (
  theme: Theme,
  name: Keyframes | string,
  duration: string = theme.transitions.duration.normal,
  easing: string = theme.transitions.function.default,
) => css`
  animation-name: ${name};
  animation-duration: ${duration};
  animation-timing-function: ${easing};
`;

export const applyTransition = (
  theme: Theme,
  property: string,
  duration: string = theme.transitions.duration.normal,
  easing: string = theme.transitions.function.default,
) => css`
  transition-property: ${property};
  transition-duration: ${duration};
  transition-timing-function: ${easing};
`;

export const transitionBase = (theme: Theme) =>
  applyTransition(
    theme,
    "background, background-color, border-color, color, box-shadow, transform, opacity, filter",
    theme.transitions.duration.normal,
    theme.transitions.function.easeInOut,
  );

// ==========================================
// 4. States & Effects
// ==========================================

export const disabledState = (theme: Theme) => css`
  &:disabled,
  &[aria-disabled="true"],
  &[data-disabled],
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${theme.colors.surface.sunken};
    border-color: ${theme.colors.border.default};
    pointer-events: none;
  }
`;

export const focusRing = (theme: Theme, isError?: boolean) => {
  const borderColor = isError
    ? theme.colors.status.danger
    : theme.colors.brand.cyan;
  const glowColor = isError
    ? theme.colors.statusBg.danger
    : theme.colors.utility.canvasGlow;
  return css`
    outline: none;
    border-color: ${borderColor};
    box-shadow: 0 0 0 ${theme.sizes.component.dividerMedium} ${glowColor};
  `;
};

export const floatingSurface = (theme: Theme) => css`
  background-color: ${theme.colors.background.surface};
  border: ${theme.sizes.component.dividerThin} solid
    ${theme.colors.border.divider};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.colors.effect.shadow.lg};
`;

// ==========================================
// 5. Component Bases (조립용 베이스)
// ==========================================

export const thinBorder = (
  theme: Theme,
  edge: "all" | "top" | "bottom" | "right" | "left" = "all",
  color: string = theme.colors.border.divider,
) => {
  const borderStyle = `${theme.sizes.component.dividerThin} solid ${color}`;
  if (edge === "all") return css({ border: borderStyle });
  return css({
    [`border${edge.charAt(0).toUpperCase() + edge.slice(1)}`]: borderStyle,
  });
};

export const componentBorder = (theme: Theme, color: string) =>
  thinBorder(theme, "all", color);
export const transparentBorder = (theme: Theme) =>
  componentBorder(theme, theme.colors.utility.transparent);
export const controlBorder = (theme: Theme, isError?: boolean) =>
  componentBorder(
    theme,
    isError ? theme.colors.status.danger : theme.colors.border.strong,
  );

export const squareIconSize = (theme: Theme, size: IconSize) => {
  const finalSize =
    theme.sizes.icon[size as keyof typeof theme.sizes.icon] || size;
  return css`
    width: ${finalSize};
    height: ${finalSize};
  `;
};

export const squareComponentSize = (theme: Theme, size: ControlSize) => {
  const finalSize =
    theme.sizes.control[size as keyof typeof theme.sizes.control] || size;
  return css`
    width: ${finalSize};
    height: ${finalSize};
  `;
};

export const controlSizeBase = (
  theme: Theme,
  size: ControlSize,
  fontSize?: FontSize,
) => {
  const themeHeight =
    theme.sizes.control[size as keyof typeof theme.sizes.control];
  const finalHeight = themeHeight || size;
  const refSize = themeHeight
    ? (size as "xs" | "sm" | "md" | "lg" | "xl")
    : "md";

  const paddingX = {
    xs: theme.spacing["2xs"],
    sm: theme.spacing.sm,
    md: theme.spacing.base,
    lg: theme.spacing.lg,
    xl: theme.spacing.xl,
  }[refSize];

  const finalFontSize = fontSize
    ? theme.fontSizes[fontSize as keyof typeof theme.fontSizes] || fontSize
    : {
        xs: theme.fontSizes["2xs"],
        sm: theme.fontSizes.sm,
        md: theme.fontSizes.base,
        lg: theme.fontSizes.lg,
        xl: theme.fontSizes.xl,
      }[refSize];

  return css`
    height: ${finalHeight};
    padding: 0 ${paddingX};
    font-size: ${finalFontSize};
  `;
};

export const compactSizeBase = (theme: Theme, size: ControlSize) => {
  const safeSize = theme.sizes.control[size as keyof typeof theme.sizes.control]
    ? size
    : "md";
  const refSize = safeSize as "xs" | "sm" | "md" | "lg" | "xl";

  const padding = {
    xs: `${theme.spacing["2xs"]} ${theme.spacing["2xs"]}`,
    sm: `${theme.spacing["2xs"]} ${theme.spacing.xs}`,
    md: `${theme.spacing["2xs"]} ${theme.spacing.sm}`,
    lg: `${theme.spacing.xs} ${theme.spacing.md}`,
    xl: `${theme.spacing.sm} ${theme.spacing.lg}`,
  }[refSize];

  const fontSize = {
    xs: theme.fontSizes["2xs"],
    sm: theme.fontSizes["2xs"],
    md: theme.fontSizes.xs,
    lg: theme.fontSizes.sm,
    xl: theme.fontSizes.base,
  }[refSize];

  const gap = {
    xs: theme.spacing["2xs"],
    sm: theme.spacing["2xs"],
    md: theme.spacing["2xs"],
    lg: theme.spacing.xs,
    xl: theme.spacing.sm,
  }[refSize];

  return css`
    padding: ${padding};
    font-size: ${fontSize};
    gap: ${gap};
  `;
};

export const formControlBase = (theme: Theme, isError?: boolean) => css`
  width: 100%;
  font-family: inherit;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background.input};
  border-radius: ${theme.borderRadius.md};

  ${controlBorder(theme, isError)}
  ${transitionBase(theme)}

  &:hover:not(:disabled):not([data-disabled]) {
    border-color: ${isError
      ? theme.colors.status.danger
      : theme.colors.brand.cyan};
  }

  &:focus,
  &:focus-within {
    ${focusRing(theme, isError)}
  }

  ${disabledState(theme)}
`;

export const popoverItemBase = (theme: Theme) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: ${theme.spacing.sm} ${theme.spacing.base};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  user-select: none;
  outline: none;
  background-color: transparent;
  gap: ${theme.spacing.md};

  ${applyTransition(
    theme,
    "background-color, color",
    theme.transitions.duration.fast,
    theme.transitions.function.easeInOut,
  )}

  &:hover,
  &[data-highlighted] {
    background-color: ${theme.colors.background.hover};
    color: ${theme.colors.text.primary};
  }

  &[data-state="checked"],
  &[aria-selected="true"] {
    color: ${theme.colors.brand.cyan};
  }
`;

export const popoverContentBase = (theme: Theme) => css`
  ${floatingSurface(theme)}
  z-index: ${theme.zIndices.popover};
  overflow-y: auto;
  ${customScrollbar(theme)}
  ${applyAnimation(
    theme,
    slideDownAndFade,
    theme.transitions.duration.fast,
    theme.transitions.function.easeOut,
  )}
`;

export const inlineComponentBase = (theme: Theme) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.fontWeights.medium};
  white-space: nowrap;
  box-sizing: border-box;
  border: none;
`;

export const interactiveTextColor = (
  theme: Theme,
  hoverColor = theme.colors.text.primary,
) => css`
  ${applyTransition(
    theme,
    "color",
    theme.transitions.duration.fast,
    theme.transitions.function.easeInOut,
  )}
  &:hover:not(:disabled):not([data-disabled]) {
    color: ${hoverColor};
  }
`;

export const activeTabUnderline = (theme: Theme) => css`
  box-shadow: inset 0 -${theme.sizes.component.dividerMedium} 0 0
    ${theme.colors.brand.cyan};
`;

// ==========================================
// 6. Utility Mixins (컬러, 높이 리졸버)
// ==========================================

export const resolveThemeColor = (theme: Theme, color: string) => {
  switch (color) {
    case "brand":
      return (
        theme.colors.brand.gradient ||
        theme.colors.brand.cyan ||
        theme.colors.brand.primary
      );
    case "primary":
      return theme.colors.brand.primary;
    case "secondary":
    case "default":
      return theme.colors.brand.accentSoft;
    case "success":
    case "danger":
    case "warning":
    case "info":
    case "offline":
      return theme.colors.status[
        color as "success" | "danger" | "warning" | "info" | "offline"
      ];
    default:
      return color;
  }
};

export const progressBarHeight = (theme: Theme, size: string) => {
  const heightMap: Record<string, string> = {
    xs: theme.spacing.xs,
    sm: theme.spacing.sm,
    md: theme.spacing.base,
    lg: theme.spacing.md,
  };
  return heightMap[size] || size;
};

// ==========================================
// 7. Master Mixin: Appearance, Color, Hover
// ==========================================

export const componentColorStyle = (
  theme: Theme,
  variant: AppearanceVariant,
  color: ColorVariant,
  isInteractive: boolean = false,
) => {
  let bg = "transparent",
    textColor = "inherit",
    borderColor = "transparent",
    hoverCss = css``;

  const opacities = theme.stateOpacity || {
    subtleBg: "1A",
    subtleBorder: "40",
    hoverBg: "26",
  };
  const filters = theme.stateFilter || {
    hoverLighten: "brightness(1.1)",
    hoverDarken: "brightness(0.9)",
  };

  const isThemeColor = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "offline",
    "brand",
    "default",
  ].includes(color as string);

  if (isThemeColor) {
    switch (color as ColorVariant) {
      case "primary":
        if (variant === "solid" || variant === "subtle") {
          bg = theme.colors.brand.primary;
          textColor = theme.colors.text.inverse || "#FFFFFF";
          borderColor = "transparent";
          hoverCss = css`
            background: ${theme.colors.brand.primaryHover};
          `;
        } else {
          textColor = theme.colors.brand.primary;
          borderColor = theme.colors.brand.primary;
          hoverCss = css`
            background: ${theme.colors.background.hover};
          `;
        }
        break;

      case "success":
      case "danger":
      case "warning":
      case "info":
      case "offline": {
        const statusKey = color as
          | "success"
          | "danger"
          | "warning"
          | "info"
          | "offline";
        if (variant === "solid") {
          bg = theme.colors.status[statusKey];
          textColor = theme.colors.text.inverse || "#FFFFFF";
          borderColor = "transparent";
          hoverCss = css`
            filter: ${filters.hoverDarken};
          `;
        } else if (variant === "subtle") {
          bg = theme.colors.statusBg[statusKey];
          textColor = theme.colors.status[statusKey];
          borderColor = theme.colors.status[statusKey];
          hoverCss = css`
            filter: ${filters.hoverDarken};
          `;
        } else {
          textColor = theme.colors.status[statusKey];
          borderColor = theme.colors.status[statusKey];
          hoverCss = css`
            background: ${theme.colors.background.hover};
          `;
        }
        break;
      }

      case "brand": {
        const hasGradient = !!theme.colors.brand.gradient;
        const brandPrimary = theme.colors.brand.primary;
        const brandText = theme.colors.brand.textColor || brandPrimary;

        if (variant === "solid") {
          bg = hasGradient ? theme.colors.brand.gradient! : brandPrimary;
          textColor =
            theme.colors.brand.textColor ||
            theme.colors.text.inverse ||
            "#FFFFFF";
          borderColor = "transparent";
          hoverCss = css`
            filter: ${filters.hoverLighten};
          `;
        } else if (variant === "subtle") {
          bg = `${brandPrimary}${opacities.subtleBg}`;
          textColor = brandText;
          borderColor = brandPrimary;
          hoverCss = css`
            filter: ${filters.hoverLighten};
          `;
        } else {
          textColor = brandText;
          borderColor = brandPrimary;
          hoverCss = css`
            background: ${theme.colors.background.hover};
          `;
        }
        break;
      }

      case "secondary":
      case "default":
      default:
        if (variant === "solid") {
          bg =
            color === "secondary"
              ? theme.colors.utility.transparent
              : theme.colors.brand.accentSoft;
          textColor = theme.colors.text.primary;
          borderColor =
            color === "secondary"
              ? theme.colors.border.strong
              : theme.colors.border.divider;
        } else if (variant === "subtle") {
          bg = theme.colors.brand.accentSoft;
          textColor = theme.colors.text.primary;
          borderColor = theme.colors.border.divider;
        } else {
          textColor =
            color === "secondary"
              ? theme.colors.text.secondary
              : theme.colors.text.primary;
          borderColor =
            color === "secondary"
              ? theme.colors.border.strong
              : theme.colors.border.divider;
        }
        hoverCss = css`
          background: ${theme.colors.background.hover};
        `;
        break;
    }
  } else {
    if (variant === "solid") {
      bg = color;
      textColor = "#FFFFFF";
      borderColor = "transparent";
      hoverCss = css`
        filter: ${filters.hoverLighten};
      `;
    } else if (variant === "subtle") {
      bg = `${color}${opacities.subtleBg}`;
      textColor = color;
      borderColor = `${color}${opacities.subtleBorder}`;
      hoverCss = css`
        background: ${color}${opacities.hoverBg};
      `;
    } else {
      textColor = color;
      borderColor = color;
      hoverCss = css`
        background: ${theme.colors.background.hover};
      `;
    }
  }

  if (variant === "ghost") {
    bg = "transparent";
    borderColor = "transparent";
  } else if (variant === "outline") {
    bg = "transparent";
  }

  const finalBorder =
    borderColor !== "transparent"
      ? `${theme.sizes.component.dividerThin} solid ${borderColor}`
      : "none";

  return css`
    background: ${bg};
    color: ${textColor};
    border: ${finalBorder};
    background-origin: border-box;

    ${isInteractive &&
    css`
      &:hover:not(:disabled):not([data-disabled]) {
        ${hoverCss}
      }
    `}
  `;
};
