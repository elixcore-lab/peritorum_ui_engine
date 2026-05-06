import React, { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import styled from "@emotion/styled";
import {
  applyTransition,
  controlBorder,
  controlDisabledStyle,
  focusRing,
  transitionBase,
} from "../../styles";
import { resolveDisabled } from "../../utils";

export interface SwitchProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "disabled"
> {
  size?: "sm" | "md" | "lg";
  isError?: boolean;
  isDisabled?: boolean;
}

const SwitchRoot = styled(SwitchPrimitive.Root)<{
  $size: "sm" | "md" | "lg";
  $isError?: boolean;
}>`
  all: unset;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  ${({ theme, $isError }) => controlBorder(theme, $isError)}
  cursor: pointer;

  width: ${({ theme, $size }) => theme.sizes.component.switch[$size].width};
  height: ${({ theme, $size }) => theme.sizes.component.switch[$size].height};

  ${({ theme }) => transitionBase(theme)}

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-state="checked"] {
    background-color: ${({ theme }) => theme.colors.brand.cyan};
    border-color: ${({ theme }) => theme.colors.brand.cyan};
  }

  &[data-disabled] {
    ${({ theme }) => controlDisabledStyle(theme)}
  }
`;

const SwitchThumb = styled(SwitchPrimitive.Thumb)<{
  $size: "sm" | "md" | "lg";
}>`
  display: block;
  background-color: ${({ theme }) => theme.colors.brand.ink};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.sm};

  width: ${({ theme, $size }) => theme.sizes.component.switch[$size].thumb};
  height: ${({ theme, $size }) => theme.sizes.component.switch[$size].thumb};

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
  transform: translateX(${({ theme }) => theme.sizes.component.dividerMedium});
  will-change: transform;

  &[data-state="checked"] {
    transform: translateX(
      ${({ theme, $size }) => theme.sizes.component.switch[$size].offset}
    );
  }
`;

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ size = "md", isDisabled, ...props }, ref) => {
  const resolvedDisabled = resolveDisabled({ isDisabled });

  return (
    <SwitchRoot ref={ref} $size={size} disabled={resolvedDisabled} {...props}>
      <SwitchThumb $size={size} />
    </SwitchRoot>
  );
});

Switch.displayName = "Switch";
