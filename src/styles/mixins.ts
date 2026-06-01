import { css, Keyframes, type Theme } from "@emotion/react";
import { ControlSize, ColorVariant, slideDownAndFade } from ".";
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
  word-break: break-all;
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
    "background-color, border-color, color, box-shadow, transform, opacity",
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

export const squareIconSize = (
  theme: Theme,
  size: keyof Theme["sizes"]["icon"],
) => css`
  width: ${theme.sizes.icon[size]};
  height: ${theme.sizes.icon[size]};
`;

export const squareComponentSize = (theme: Theme, size: ControlSize) => css`
  width: ${theme.sizes.control[size]};
  height: ${theme.sizes.control[size]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
    /* background-color: ${theme.colors.background.hover}; */
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

export const solidVariantStyle = (theme: Theme, variant: ColorVariant) => {
  switch (variant) {
    case "secondary":
    case "outline":
      return css`
        background-color: ${theme.colors.utility.transparent};
        border-color: ${theme.colors.border.strong};
        color: ${theme.colors.text.primary};
        &:hover:not(:disabled):not([data-disabled]) {
          background-color: ${theme.colors.background.hover};
        }
      `;
    case "ghost":
      return css`
        background-color: ${theme.colors.utility.transparent};
        border-color: transparent;
        color: ${theme.colors.text.primary};
        &:hover:not(:disabled):not([data-disabled]) {
          background-color: ${theme.colors.background.hover};
        }
      `;
    case "danger":
      return css`
        background-color: ${theme.colors.status.danger};
        border-color: transparent;
        color: ${theme.colors.text.inverse};
        &:hover:not(:disabled):not([data-disabled]) {
          filter: brightness(0.9);
        }
      `;
    case "warning":
      return css`
        background-color: ${theme.colors.status.warning};
        border-color: transparent;
        color: ${theme.colors.text.inverse};
        &:hover:not(:disabled):not([data-disabled]) {
          filter: brightness(0.9);
        }
      `;
    case "success":
      return css`
        background-color: ${theme.colors.status.success};
        border-color: transparent;
        color: ${theme.colors.text.inverse};
        &:hover:not(:disabled):not([data-disabled]) {
          filter: brightness(0.9);
        }
      `;
    case "info":
      return css`
        background-color: ${theme.colors.status.info};
        border-color: transparent;
        color: ${theme.colors.text.inverse};
        &:hover:not(:disabled):not([data-disabled]) {
          filter: brightness(0.9);
        }
      `;
    case "default":
      return css`
        background-color: ${theme.colors.brand.accentSoft};
        border-color: ${theme.colors.border.divider};
        color: ${theme.colors.text.primary};
        &:hover:not(:disabled):not([data-disabled]) {
          background-color: ${theme.colors.background.hover};
        }
      `;
    case "primary":
    default:
      return css`
        background-color: ${theme.colors.brand.primary};
        border-color: transparent;
        color: ${theme.colors.text.inverse};
        &:hover:not(:disabled):not([data-disabled]) {
          background-color: ${theme.colors.brand.primaryHover};
        }
      `;
  }
};

export const subtleVariantStyle = (theme: Theme, variant: ColorVariant) => {
  switch (variant) {
    case "primary":
      return css`
        background-color: ${theme.colors.brand.primary};
        color: ${theme.colors.text.inverse};
        border-color: transparent;
      `;
    case "success":
      return css`
        background-color: ${theme.colors.statusBg.success};
        color: ${theme.colors.status.success};
        border-color: ${theme.colors.status.success};
      `;
    case "danger":
      return css`
        background-color: ${theme.colors.statusBg.danger};
        color: ${theme.colors.status.danger};
        border-color: ${theme.colors.status.danger};
      `;
    case "warning":
      return css`
        background-color: ${theme.colors.statusBg.warning};
        color: ${theme.colors.status.warning};
        border-color: ${theme.colors.status.warning};
      `;
    case "info":
      return css`
        background-color: ${theme.colors.statusBg.info};
        color: ${theme.colors.status.info};
        border-color: ${theme.colors.status.info};
      `;
    case "ghost":
    case "secondary":
    case "default":
    default:
      return css`
        background-color: ${theme.colors.brand.accentSoft};
        color: ${theme.colors.text.primary};
        border-color: ${theme.colors.border.divider};
      `;
  }
};

export const inlineComponentBase = (theme: Theme) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.fontWeights.medium};
  white-space: nowrap;
  box-sizing: border-box;
  border-radius: ${theme.borderRadius.sm};
  border: ${theme.sizes.component.dividerThin} solid
    ${theme.colors.utility.transparent};
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
