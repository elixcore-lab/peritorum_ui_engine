import { css, Keyframes, type Theme } from "@emotion/react";

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

// 화면 전체를 덮는 오버레이용
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

export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

export const lineClamp = (lines: number) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
`;

export const disabledState = (theme: Theme) => css`
  &:disabled,
  &[aria-disabled="true"],
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${theme.colors.surface.sunken};
    border-color: ${theme.colors.border.default};
    pointer-events: none;
  }
`;

export const customScrollbar = (theme: Theme) => css`
  /* Firefox 대응 */
  /* @supports (-moz-appearance: none) {
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.background.scrollbar} transparent;
  } */

  crollbar-width: thin;
  scrollbar-color: ${theme.colors.background.scrollbar} transparent;

  /* Chrome, Edge, Safari 대응 */
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
    "background-color, border-color, color, box-shadow, transform, opacity", // property
    theme.transitions.duration.normal, // duration
    theme.transitions.function.easeInOut, // easing
  );

// 폼 컨트롤 (Input, Select, Textarea) 공통 형상
export const formControlBase = (theme: Theme, isError?: boolean) => css`
  width: 100%;
  font-family: inherit;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background.input};
  border-radius: ${theme.borderRadius.md};
  border: ${theme.sizes.component.dividerThin} solid
    ${isError ? theme.colors.status.danger : theme.colors.border.strong};

  ${transitionBase(theme)}

  &:hover:not(:disabled) {
    border-color: ${isError
      ? theme.colors.status.danger
      : theme.colors.brand.cyan};
  }

  &:focus,
  &:focus-within {
    ${focusRing(theme, isError)}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${theme.colors.surface.sunken};
    border-color: ${theme.colors.border.default};
  }
`;

// 화면에 뜨는 오버레이 표면 (Modal, Dropdown, Popover) 공통 형상
export const floatingSurface = (theme: Theme) => css`
  background-color: ${theme.colors.background.surface};
  border: ${theme.sizes.component.dividerThin} solid
    ${theme.colors.border.divider};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.colors.effect.shadow.lg};
`;

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

export const activeTabUnderline = (theme: Theme) => css`
  box-shadow: inset 0 -${theme.sizes.component.dividerMedium} 0 0
    ${theme.colors.brand.cyan};
`;
