import React, { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import styled from "@emotion/styled";
import { type ColorVariant, type ControlSize } from "../../styles/types";
import {
  applyTransition,
  resolveThemeColor,
  progressBarHeight,
} from "../../styles/mixins";

export interface ProgressBarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  "color"
> {
  value: number;
  color?: ColorVariant;
  size?: ControlSize;
}

export const ProgressBar = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ value, color = "brand", size = "md", ...props }, ref) => {
  const safeValue = Math.min(100, Math.max(0, value || 0));

  return (
    <ProgressRoot ref={ref} value={safeValue} $size={size} {...props}>
      <ProgressIndicator
        $color={color}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
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
  shouldForwardProp: (prop: string) => !["$color"].includes(prop),
};

const ProgressRoot = styled(ProgressPrimitive.Root, rootFilter)<{
  $size: string;
}>`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  width: 100%;
  box-shadow: inset 0 1px 2px ${({ theme }) => theme.colors.utility.shadowColor};

  height: ${({ theme, $size }) => progressBarHeight(theme, $size)};
`;

const ProgressIndicator = styled(ProgressPrimitive.Indicator, indicatorFilter)<{
  $color: string;
}>`
  width: 100%;
  height: 100%;
  border-radius: inherit;

  background: ${({ theme, $color }) => resolveThemeColor(theme, $color)};

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform",
      theme.transitions.duration.slow,
      theme.transitions.function.easeOut,
    )}
`;
