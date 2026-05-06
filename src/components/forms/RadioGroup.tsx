import React, { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import styled from "@emotion/styled";
import {
  controlBorder,
  controlDisabledStyle,
  flexCenter,
  focusRing,
  transitionBase,
} from "../../styles";
import { resolveDisabled } from "../../utils";

export interface RadioOption {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "disabled"
> {
  options: RadioOption[];
  isError?: boolean;
  isDisabled?: boolean;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ options, isError, isDisabled, ...props }, ref) => {
    const resolvedDisabled = resolveDisabled({ isDisabled });

    return (
      <StyledRadioGroupRoot ref={ref} disabled={resolvedDisabled} {...props}>
        {options.map((option) => {
          const isOptionDisabled = resolvedDisabled || resolveDisabled(option);

          return (
            <OptionWrapper key={option.value}>
              <StyledRadioItem
                value={option.value}
                id={option.value}
                disabled={isOptionDisabled}
                $isError={isError}
              >
                <StyledIndicator />
              </StyledRadioItem>
              <Label htmlFor={option.value} $isDisabled={isOptionDisabled}>
                {option.label}
              </Label>
            </OptionWrapper>
          );
        })}
      </StyledRadioGroupRoot>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

const StyledRadioGroupRoot = styled(RadioGroupPrimitive.Root)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledRadioItem = styled(RadioGroupPrimitive.Item)<{
  $isError?: boolean;
}>`
  all: unset;
  width: ${({ theme }) => theme.sizes.component.radio};
  height: ${({ theme }) => theme.sizes.component.radio};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  ${({ theme, $isError }) => controlBorder(theme, $isError)}
  background-color: ${({ theme }) => theme.colors.background.input};
  cursor: pointer;
  ${flexCenter}

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled) {
    border-color: ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.brand.cyan};
  }

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-state="checked"] {
    border-color: ${({ theme }) => theme.colors.brand.cyan};
  }

  &[data-disabled] {
    ${({ theme }) => controlDisabledStyle(theme)}
  }
`;

const StyledIndicator = styled(RadioGroupPrimitive.Indicator)`
  ${flexCenter}
  width: ${({ theme }) => theme.sizes.component.radioIndicator};
  height: ${({ theme }) => theme.sizes.component.radioIndicator};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.brand.cyan};
`;

const Label = styled.label<{ $isDisabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $isDisabled }) =>
    $isDisabled ? theme.colors.text.disabled : theme.colors.text.primary};
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  user-select: none;
`;
