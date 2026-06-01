import React, { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import styled from "@emotion/styled";
import { applyTransition } from "../../styles/mixins";

export interface ProgressBarProps extends React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> {
  value: number; // 0 ~ 100
  color?: string; // 기본값: Cyan
}

export const ProgressBar = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({ value, color, ...props }, ref) => {
  return (
    <ProgressRoot ref={ref} value={value} {...props}>
      <ProgressIndicator
        $color={color}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressRoot>
  );
});
ProgressBar.displayName = "ProgressBar";

const ProgressRoot = styled(ProgressPrimitive.Root)`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  width: 100%;
  height: ${({ theme }) => theme.spacing.sm};
  box-shadow: inset 0 1px 2px ${({ theme }) => theme.colors.utility.shadowColor};
`;

const ProgressIndicator = styled(ProgressPrimitive.Indicator)<{
  $color?: string;
}>`
  width: 100%;
  height: 100%;
  background-color: ${({ theme, $color }) => $color || theme.colors.brand.cyan};
  border-radius: inherit;

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform",
      theme.transitions.duration.slow,
      theme.transitions.function.easeOut,
    )}
`;
