import { css, Keyframes, type Theme } from "@emotion/react";
import {
  ControlSize,
  ColorVariant,
  AppearanceVariant,
  ComponentColor,
  IconSize,
} from "./types";
import { slideDownAndFade } from "./animation";

// ==========================================
// 1. Layout & Resets (레이아웃 및 초기화)
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
// 2. Typography & Scroll (타이포그래피 및 스크롤)
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

// 💡 텍스트에 그라데이션을 입히는 믹스인 (Text 컴포넌트 등에서 사용)
export const textGradientStyle = (gradientString: string) => css`
  background: ${gradientString};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent; /* Fallback */
`;

// ==========================================
// 3. Animation & Transition (애니메이션 및 트랜지션)
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
// 4. States & Effects (전역 상태 및 시각 효과)
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
// 5. Component Bases (컴포넌트 조립용 베이스)
// ==========================================

export const thinBorder = (
  theme: Theme,
  edge: "all" | "top" | "bottom" | "right" | "left" = "all",
  color: string = theme.colors.border.divider,
) => {
  const borderStyle = `${theme.sizes.component.dividerThin} solid ${color}`;

  if (edge === "all") {
    return css({ border: borderStyle });
  }

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

export const squareIconSize = (theme: Theme, size: IconSize) => css`
  width: ${theme.sizes.icon[size]};
  height: ${theme.sizes.icon[size]};
`;

export const squareComponentSize = (theme: Theme, size: ControlSize) => css`
  width: ${theme.sizes.control[size]};
  height: ${theme.sizes.control[size]};
`;

export const controlSizeBase = (theme: Theme, size: ControlSize) => {
  switch (size) {
    case "xs":
      return css`
        height: ${theme.sizes.control.xs};
        padding: 0 ${theme.spacing["2xs"]};
        font-size: ${theme.fontSizes["2xs"]};
      `;
    case "sm":
      return css`
        height: ${theme.sizes.control.sm};
        padding: 0 ${theme.spacing.sm};
        font-size: ${theme.fontSizes.sm};
      `;
    case "lg":
      return css`
        height: ${theme.sizes.control.lg};
        padding: 0 ${theme.spacing.lg};
        font-size: ${theme.fontSizes.lg};
      `;
    case "md":
    default:
      return css`
        height: ${theme.sizes.control.md};
        padding: 0 ${theme.spacing.base};
        font-size: ${theme.fontSizes.base};
      `;
  }
};

export const compactSizeBase = (theme: Theme, size: ControlSize) => {
  switch (size) {
    case "lg":
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.md};
        font-size: ${theme.fontSizes.sm};
        gap: ${theme.spacing.xs};
      `;
    case "sm":
      return css`
        padding: ${theme.spacing["2xs"]} ${theme.spacing.xs};
        font-size: ${theme.fontSizes["2xs"]};
        gap: ${theme.spacing["2xs"]};
      `;
    case "xs":
      return css`
        padding: ${theme.spacing["2xs"]} ${theme.spacing["2xs"]};
        font-size: ${theme.fontSizes["2xs"]};
        gap: ${theme.spacing["2xs"]};
      `;
    case "md":
    default:
      return css`
        padding: ${theme.spacing["2xs"]} ${theme.spacing.sm};
        font-size: ${theme.fontSizes.xs};
        gap: ${theme.spacing["2xs"]};
      `;
  }
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
// 6. 외형(Appearance), 색상(Color), 인터랙션(Hover)을 통제하는 마스터 믹스인
// ==========================================
export const componentColorStyle = (
  theme: Theme,
  variant: AppearanceVariant,
  color: ComponentColor,
  isInteractive: boolean = false,
) => {
  let bg = "transparent",
    textColor = "inherit",
    borderColor = "transparent",
    hoverCss = css``;

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
            filter: brightness(0.9);
          `;
        } else if (variant === "subtle") {
          bg = theme.colors.statusBg[statusKey];
          textColor = theme.colors.status[statusKey];
          borderColor = theme.colors.status[statusKey];
          hoverCss = css`
            filter: brightness(0.9);
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
      case "brand":
        // 테마에 그라데이션 값이 있으면 사용하고, 없으면 안전하게 폴백 컬러 사용
        const hasGradient = !!theme.colors.brand.gradient;
        const brandBaseColor =
          theme.colors.brand.cyan || theme.colors.brand.primary;

        if (variant === "solid") {
          bg = hasGradient ? theme.colors.brand.gradient! : brandBaseColor;
          textColor = theme.colors.text.inverse || "#FFFFFF";
          borderColor = "transparent";
          hoverCss = css`
            filter: brightness(1.1);
          `;
        } else if (variant === "subtle") {
          bg = `${brandBaseColor}1A`;
          textColor = brandBaseColor;
          borderColor = brandBaseColor;
          hoverCss = css`
            filter: brightness(1.1);
          `;
        } else {
          textColor = brandBaseColor;
          borderColor = brandBaseColor;
          hoverCss = css`
            background: ${theme.colors.background.hover};
          `;
        }
        break;

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
    // --------------------------------------------------------
    // 직접 주입된 커스텀 Hex 컬러 (#RRGGBB) 처리
    // --------------------------------------------------------
    if (variant === "solid") {
      bg = color;
      textColor = "#FFFFFF";
      borderColor = "transparent";
      hoverCss = css`
        filter: brightness(1.1);
      `;
    } else if (variant === "subtle") {
      bg = `${color}1A`;
      textColor = color;
      borderColor = `${color}40`;
      hoverCss = css`
        background: ${color}26;
      `; // 10% -> 15% 투명도 증가 (Hover)
    } else {
      textColor = color;
      borderColor = color;
      hoverCss = css`
        background: ${theme.colors.background.hover};
      `;
    }
  }

  // Ghost, Outline은 기본적으로 배경과 테두리를 투명/없음 처리
  if (variant === "ghost") {
    bg = "transparent";
    borderColor = "transparent";
  } else if (variant === "outline") {
    bg = "transparent";
  }

  // --------------------------------------------------------
  // 최종 CSS 조립 (background 속성을 사용하여 그라데이션까지 완벽 지원)
  // --------------------------------------------------------
  return css`
    background: ${bg};
    color: ${textColor};
    /* border: ${borderColor !== "transparent"
      ? `1px solid ${borderColor}`
      : "none"}; */
    border: 1px solid ${borderColor};
    background-origin: border-box;
    /* 인터랙션 플래그가 true인 요소(버튼 등)에만 Hover 효과 부여 */
    ${isInteractive &&
    css`
      &:hover:not(:disabled):not([data-disabled]) {
        ${hoverCss}
      }
    `}
  `;
};
