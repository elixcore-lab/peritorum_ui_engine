import React, { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { type ControlSize } from "../../styles/types";
import {
  applyTransition,
  focusRing,
  transitionBase,
  disabledState,
  flexCenter,
  squareIconSize,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";
import { Label } from "./Label";
import { Spinner } from "../feedback/Spinner";

export type SwitchSize = Extract<ControlSize, "sm" | "md" | "lg">;

export interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> {
  size?: SwitchSize;
  label?: string;
  description?: string;
  labelPosition?: "left" | "right";
  isError?: boolean;
  isLoading?: boolean;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
}

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      size = "md",
      label,
      description,
      labelPosition = "right",
      isError,
      isLoading,
      disabled,
      iconOn,
      iconOff,
      id,
      className,
      checked,
      ...props
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    return (
      <SwitchWrapper className={className} $labelPosition={labelPosition}>
        {(label || description) && (
          <SwitchLabelGroup $labelPosition={labelPosition}>
            {label && (
              <Label
                htmlFor={id}
                disabled={trulyDisabled}
                style={{ cursor: "inherit" }}
              >
                {label}
              </Label>
            )}
            {description && (
              <SwitchDescription $disabled={trulyDisabled}>
                {description}
              </SwitchDescription>
            )}
          </SwitchLabelGroup>
        )}

        <StyledSwitch
          ref={ref}
          id={id}
          $size={size}
          $isError={isError}
          disabled={trulyDisabled}
          aria-invalid={isError}
          checked={checked}
          {...props}
        >
          <SwitchThumb $size={size}>
            {isLoading ? (
              <Spinner size="xs" color="currentColor" />
            ) : (
              <ThumbIconWrapper>{checked ? iconOn : iconOff}</ThumbIconWrapper>
            )}
          </SwitchThumb>
        </StyledSwitch>
      </SwitchWrapper>
    );
  },
);

Switch.displayName = "Switch";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) => !["$size", "$isError"].includes(prop),
};

const SwitchWrapper = styled.div<{ $labelPosition: "left" | "right" }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.base};

  ${({ $labelPosition }) =>
    $labelPosition === "left" &&
    css`
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    `}
`;

const SwitchLabelGroup = styled.div<{ $labelPosition: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["2xs"]};
  order: ${({ $labelPosition }) => ($labelPosition === "left" ? 0 : 1)};
`;

const SwitchDescription = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.secondary};
`;

const StyledSwitch = styled(SwitchPrimitive.Root, filterProps)<{
  $size: SwitchSize;
  $isError?: boolean;
}>`
  all: unset;
  position: relative;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.border.strong};
  cursor: pointer;

  width: ${({ theme, $size }) => theme.sizes.component.switch[$size].width};
  height: ${({ theme, $size }) => theme.sizes.component.switch[$size].height};

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled):not([data-disabled]) {
    border-color: ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.brand.cyan};
  }

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-state="checked"] {
    background-color: ${({ theme }) => theme.colors.brand.cyan};
    border-color: ${({ theme }) => theme.colors.brand.cyan};
  }

  ${({ theme }) => disabledState(theme)}
`;

const SwitchThumb = styled(SwitchPrimitive.Thumb, filterProps)<{
  $size: SwitchSize;
}>`
  ${flexCenter}
  background-color: ${({ theme }) => theme.colors.brand.ink};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.sm};

  width: ${({ theme, $size }) => theme.sizes.component.switch[$size].thumb};
  height: ${({ theme, $size }) => theme.sizes.component.switch[$size].thumb};

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform, background-color",
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

const ThumbIconWrapper = styled.div`
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.secondary};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
  }
`;
