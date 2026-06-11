import React, { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import styled from "@emotion/styled";
import { type ColorVariant, type ControlSize } from "../../styles/types";
import {
  applyTransition,
  resolveThemeColor,
  progressBarHeight,
} from "../../styles/mixins";
import { clamp } from "../../utils";

/**
 * ProgressBar의 현재 값, 색상 intent, 높이 토큰을 정의합니다.
 *
 * value는 0-100 범위로 보정되며, 색상과 높이는 theme token/mixin을 통해 계산합니다.
 */
export interface ProgressBarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  "color" | "style"
> {
  value: number;
  color?: ColorVariant;
  size?: ControlSize;
}

/**
 * 작업 진행률을 표시하는 Radix 기반 progress 컴포넌트입니다.
 *
 * inline style 없이 transient prop으로 indicator transform을 계산하고, 표준
 * Progress Root 속성과 ref를 전달할 수 있습니다.
 */
export const ProgressBar = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ value, color = "brand", size = "md", ...props }, ref) => {
  const safeValue = clamp(value || 0, 0, 100);

  return (
    <ProgressRoot ref={ref} value={safeValue} $size={size} {...props}>
      <ProgressIndicator $color={color} $value={safeValue} />
    </ProgressRoot>
  );
});

ProgressBar.displayName = "ProgressBar";

// ==========================================
// Styled Components
// ==========================================

const rootFilter = {
  shouldForwardProp: (prop: string) => !["$size"].includes(prop),
};

const indicatorFilter = {
  shouldForwardProp: (prop: string) => !["$color", "$value"].includes(prop),
};

const ProgressRoot = styled(ProgressPrimitive.Root, rootFilter)<{
  $size: string;
}>`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  width: 100%;
  box-shadow: inset ${({ theme }) => theme.spacing.none}
    ${({ theme }) => theme.sizes.component.dividerThin}
    ${({ theme }) => theme.spacing["2xs"]}
    ${({ theme }) => theme.colors.utility.shadowColor};

  height: ${({ theme, $size }) => progressBarHeight(theme, $size)};
`;

const ProgressIndicator = styled(ProgressPrimitive.Indicator, indicatorFilter)<{
  $color: string;
  $value: number;
}>`
  width: 100%;
  height: 100%;
  border-radius: inherit;

  background: ${({ theme, $color }) => resolveThemeColor(theme, $color)};
  transform: translateX(-${({ $value }) => 100 - $value}%);

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform",
      theme.transitions.duration.slow,
      theme.transitions.function.easeOut,
    )}
`;
