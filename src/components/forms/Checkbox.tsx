import React, { CSSProperties, forwardRef } from "react";
import * as CheckBoxPrimitive from "@radix-ui/react-checkbox";
import styled from "@emotion/styled";
import { css, Theme } from "@emotion/react";
import { Check, Minus } from "lucide-react";
import { type SelectionVariant, type SelectionValue } from "../../styles/types";
import {
  flexCenter,
  focusRing,
  transitionBase,
  disabledState,
  squareIconSize,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";
import { Label } from "./Label";
import { Spinner } from "../feedback/Spinner";

export interface CheckBoxOption {
  label: string;
  value: SelectionValue;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CheckBoxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckBoxPrimitive.Root>,
  "checked" | "onChange" | "value"
> {
  label?: string;
  description?: string;
  isError?: boolean;
  isLoading?: boolean;
  variant?: SelectionVariant;
  checked?: boolean | "indeterminate";
  value?: SelectionValue;
  onChange?: (checked: boolean | "indeterminate") => void;
}

export interface CheckBoxGroupProps {
  options: CheckBoxOption[];
  value: SelectionValue[];
  onChange: (value: SelectionValue[]) => void;
  disabled?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  direction?: CSSProperties["flexDirection"];
  variant?: SelectionVariant;
  className?: string;
  gap?: keyof Theme["spacing"] | CSSProperties["gap"];
}

export const CheckBox = forwardRef<HTMLButtonElement, CheckBoxProps>(
  (
    {
      label,
      description,
      isError,
      isLoading,
      disabled,
      id,
      className,
      variant = "default",
      checked = false,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });
    const domId = id || (value !== undefined ? String(value) : undefined);

    return (
      <CheckBoxWrapper className={className} $variant={variant}>
        <StyledCheckBox
          ref={ref}
          id={domId}
          value={value !== undefined ? String(value) : undefined}
          $isError={isError}
          $variant={variant}
          disabled={trulyDisabled}
          checked={checked === "indeterminate" ? "indeterminate" : checked}
          onCheckedChange={onChange}
          aria-invalid={isError}
          {...props}
        >
          {isLoading ? (
            <SpinnerWrapper>
              <Spinner size="xxs" color="currentColor" />
            </SpinnerWrapper>
          ) : (
            <CheckBoxPrimitive.Indicator asChild>
              <CheckBoxIndicator>
                <CheckBoxIconWrapper>
                  {checked === "indeterminate" ? <Minus /> : <Check />}
                </CheckBoxIconWrapper>
              </CheckBoxIndicator>
            </CheckBoxPrimitive.Indicator>
          )}
        </StyledCheckBox>

        {(label || description) && (
          <CheckBoxLabelContent>
            {label && (
              <Label
                htmlFor={domId}
                disabled={trulyDisabled}
                style={{ cursor: "inherit" }}
              >
                {label}
              </Label>
            )}
            {description && (
              <CheckBoxDescription $disabled={trulyDisabled}>
                {description}
              </CheckBoxDescription>
            )}
          </CheckBoxLabelContent>
        )}
      </CheckBoxWrapper>
    );
  },
);

CheckBox.displayName = "CheckBox";

export const CheckBoxGroup = forwardRef<HTMLDivElement, CheckBoxGroupProps>(
  (
    {
      options,
      value,
      onChange,
      disabled,
      isError,
      isLoading,
      direction = "column",
      gap,
      variant = "default",
      className,
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    const handleCheckBoxChange = (
      optionValue: SelectionValue,
      isChecked: boolean | "indeterminate",
    ) => {
      if (isChecked === true) {
        onChange([...value, optionValue]);
      } else {
        onChange(value.filter((v) => v !== optionValue));
      }
    };

    return (
      <CheckBoxGroupRoot
        ref={ref}
        $direction={direction}
        $gap={gap}
        className={className}
      >
        {options.map((option) => {
          const isOptionDisabled =
            trulyDisabled || resolveDisabled({ disabled: option.disabled });
          const isOptionChecked = value.includes(option.value);

          return (
            <CheckBox
              key={String(option.value)}
              id={String(option.value)}
              value={option.value}
              label={option.label}
              description={option.description}
              disabled={isOptionDisabled}
              isError={isError}
              isLoading={isLoading}
              variant={variant}
              checked={isOptionChecked}
              onChange={(isChecked) =>
                handleCheckBoxChange(option.value, isChecked)
              }
            />
          );
        })}
      </CheckBoxGroupRoot>
    );
  },
);

CheckBoxGroup.displayName = "CheckBoxGroup";

const CheckBoxGroupRoot = styled.div<{
  $direction: CSSProperties["flexDirection"];
  $gap?: keyof Theme["spacing"] | CSSProperties["gap"];
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};

  gap: ${({ theme, $gap }) => {
    if (!$gap) return theme.spacing.sm;
    if ($gap in theme.spacing) {
      return theme.spacing[$gap as keyof Theme["spacing"]];
    }
    return $gap;
  }};
`;

const CheckBoxWrapper = styled.div<{ $variant: SelectionVariant }>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme, $variant }) =>
    $variant === "card" &&
    css`
      flex: 1;
      padding: ${theme.spacing.md};
      border: ${theme.sizes.component.dividerThin} solid
        ${theme.colors.border.strong};
      border-radius: ${theme.borderRadius.md};
      background-color: ${theme.colors.background.surface};
      cursor: pointer;
      ${transitionBase(theme)}

      &:hover:not([data-disabled]) {
        border-color: ${theme.colors.brand.cyan};
        background-color: ${theme.colors.background.hover};
      }

      &:has([data-state="checked"]),
      &:has([data-state="indeterminate"]) {
        border-color: ${theme.colors.brand.cyan};
        background-color: ${theme.colors.statusBg.info};
      }
    `}
`;

const StyledCheckBox = styled(CheckBoxPrimitive.Root)<{
  $isError?: boolean;
  $variant: SelectionVariant;
}>`
  all: unset;
  ${flexCenter}
  width: ${({ theme }) => theme.sizes.component.checkbox};
  height: ${({ theme }) => theme.sizes.component.checkbox};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.border.strong};
  background-color: ${({ theme }) => theme.colors.background.input};
  cursor: pointer;
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing.xxs};

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled):not([data-disabled]) {
    border-color: ${({ theme }) => theme.colors.brand.cyan};
  }

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-state="checked"],
  &[data-state="indeterminate"] {
    background-color: ${({ theme }) => theme.colors.brand.cyan};
    border-color: ${({ theme }) => theme.colors.brand.cyan};
  }

  ${({ theme }) => disabledState(theme)}
`;

const CheckBoxIndicator = styled.div`
  color: ${({ theme }) => theme.colors.text.inverse};
  ${flexCenter}
`;

const CheckBoxIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
    stroke-width: ${({ theme }) => theme.sizes.component.dividerMedium};
  }
`;

const SpinnerWrapper = styled.div`
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.secondary};

  [data-state="checked"] &,
  &[data-state="indeterminate"] & {
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`;

const CheckBoxLabelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  cursor: inherit;
`;

const CheckBoxDescription = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.secondary};
`;
