import React, { forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import styled from "@emotion/styled";
import {
  controlBorder,
  controlDisabledStyle,
  flexCenter,
  focusRing,
  transitionBase,
} from "../../styles";
import { resolveDisabled } from "../../utils";

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "disabled"
> {
  label?: string;
  isError?: boolean;
  isDisabled?: boolean;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, isError, isDisabled, id, className, ...props }, ref) => {
    const resolvedDisabled = resolveDisabled({ isDisabled });

    return (
      <Container className={className}>
        <StyledCheckboxRoot
          ref={ref}
          id={id}
          $isError={isError}
          disabled={resolvedDisabled}
          {...props}
        >
          <CheckboxPrimitive.Indicator asChild>
            <StyledIndicator>
              <CheckIcon />
            </StyledIndicator>
          </CheckboxPrimitive.Indicator>
        </StyledCheckboxRoot>
        {label && (
          <Label htmlFor={id} $isDisabled={resolvedDisabled}>
            {label}
          </Label>
        )}
      </Container>
    );
  },
);

Checkbox.displayName = "Checkbox";

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledCheckboxRoot = styled(CheckboxPrimitive.Root)<{
  $isError?: boolean;
}>`
  all: unset;
  ${flexCenter}
  width: ${({ theme }) => theme.sizes.component.checkbox};
  height: ${({ theme }) => theme.sizes.component.checkbox};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  ${({ theme, $isError }) => controlBorder(theme, $isError)}
  background-color: ${({ theme }) => theme.colors.background.input};
  cursor: pointer;

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled) {
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

  &[data-disabled] {
    ${({ theme }) => controlDisabledStyle(theme)}
  }
`;

const StyledIndicator = styled.div`
  color: ${({ theme }) => theme.colors.text.inverse};
  ${flexCenter}
`;

const CheckIcon = styled(Check)`
  width: ${({ theme }) => theme.sizes.icon.xs};
  height: ${({ theme }) => theme.sizes.icon.xs};
  stroke-width: ${({ theme }) => theme.sizes.component.dividerMedium};
`;

const Label = styled.label<{ $isDisabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $isDisabled }) =>
    $isDisabled ? theme.colors.text.disabled : theme.colors.text.primary};
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  user-select: none;
`;
