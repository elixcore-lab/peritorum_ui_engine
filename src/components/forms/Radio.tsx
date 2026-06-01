import React, { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { type RadioVariant, type SelectionValue } from "../../styles/types";
import {
  flexCenter,
  focusRing,
  transitionBase,
  disabledState,
  squareIconSize,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";
import { Label } from "./Label";

export interface RadioProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  "value"
> {
  value: SelectionValue;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  isError?: boolean;
  variant?: RadioVariant;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  (
    {
      id,
      value,
      label,
      description,
      icon,
      isError,
      disabled,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled });
    const stringValue = String(value);
    const domId = id || stringValue;

    return (
      <RadioOptionWrapper $variant={variant}>
        <RadioItem
          ref={ref}
          value={stringValue}
          id={domId}
          disabled={trulyDisabled}
          $isError={isError}
          $variant={variant}
          aria-invalid={isError}
          {...props}
        >
          {variant !== "segmented" && <RadioIndicator />}
          {variant === "segmented" && <SegmentedLabel>{label}</SegmentedLabel>}
        </RadioItem>

        {variant !== "segmented" && (label || description) && (
          <RadioLabelContent>
            {label && (
              <Label
                htmlFor={domId}
                disabled={trulyDisabled}
                style={{ cursor: "inherit" }}
              >
                <LabelTitleWrapper>
                  {icon && <IconSlot>{icon}</IconSlot>}
                  {label}
                </LabelTitleWrapper>
              </Label>
            )}
            {description && (
              <OptionDescription $disabled={trulyDisabled}>
                {description}
              </OptionDescription>
            )}
          </RadioLabelContent>
        )}
      </RadioOptionWrapper>
    );
  },
);

Radio.displayName = "Radio";

export interface RadioOption {
  label: string;
  value: SelectionValue;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface RadioGroupProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  "dir" | "value" | "defaultValue" | "onValueChange"
> {
  options?: RadioOption[];
  value?: SelectionValue;
  defaultValue?: SelectionValue;
  onValueChange?: (value: string) => void;
  isError?: boolean;
  direction?: "row" | "column";
  variant?: RadioVariant;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      options,
      children,
      isError,
      disabled,
      direction = "column",
      variant = "default",
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled });

    return (
      <RadioGroupRoot
        ref={ref}
        value={value !== undefined ? String(value) : undefined}
        defaultValue={
          defaultValue !== undefined ? String(defaultValue) : undefined
        }
        disabled={trulyDisabled}
        $direction={direction}
        $variant={variant}
        {...props}
      >
        {options
          ? options.map((option) => {
              const isOptionDisabled =
                trulyDisabled || resolveDisabled({ disabled: option.disabled });

              return (
                <Radio
                  key={String(option.value)}
                  value={option.value}
                  label={option.label}
                  description={option.description}
                  icon={option.icon}
                  disabled={isOptionDisabled}
                  isError={isError}
                  variant={variant}
                />
              );
            })
          : children}
      </RadioGroupRoot>
    );
  },
);

RadioGroup.displayName = "RadioGroup";

const RadioGroupRoot = styled(RadioGroupPrimitive.Root)<{
  $direction: "row" | "column";
  $variant: RadioVariant;
}>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ $direction }) => css`
    flex-direction: ${$direction};
  `}

  ${({ theme, $variant }) =>
    $variant === "segmented" &&
    css`
      background-color: ${theme.colors.surface.sunken};
      padding: ${theme.spacing["2xs"]};
      border-radius: ${theme.borderRadius.md};
      gap: 0;
    `}
`;

const RadioOptionWrapper = styled.div<{
  $variant: RadioVariant;
}>`
  display: flex;
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

      &:has([data-state="checked"]) {
        border-color: ${theme.colors.brand.cyan};
        background-color: ${theme.colors.statusBg.info};
      }
    `}

  ${({ $variant }) =>
    $variant === "segmented" &&
    css`
      flex: 1;
    `}
`;

const RadioItem = styled(RadioGroupPrimitive.Item)<{
  $isError?: boolean;
  $variant: RadioVariant;
}>`
  all: unset;
  ${flexCenter}
  cursor: pointer;
  ${({ theme }) => transitionBase(theme)}

  ${({ theme, $isError, $variant }) =>
    $variant !== "segmented" &&
    css`
      width: ${theme.sizes.component.radio};
      height: ${theme.sizes.component.radio};
      border-radius: ${theme.borderRadius.round};
      border: ${theme.sizes.component.dividerThin} solid
        ${$isError ? theme.colors.status.danger : theme.colors.border.strong};
      background-color: ${theme.colors.background.input};
      flex-shrink: 0;
      margin-top: ${theme.spacing["2xs"]};

      &:hover:not(:disabled):not([data-disabled]) {
        border-color: ${theme.colors.brand.cyan};
      }

      &[data-state="checked"] {
        border-color: ${theme.colors.brand.cyan};
      }
    `}

  ${({ theme, $variant }) =>
    $variant === "segmented" &&
    css`
      width: 100%;
      height: ${theme.sizes.control.sm};
      border-radius: ${theme.borderRadius.sm};
      color: ${theme.colors.text.secondary};
      font-size: ${theme.fontSizes.sm};
      font-weight: ${theme.fontWeights.medium};

      &:hover:not(:disabled):not([data-disabled]) {
        color: ${theme.colors.text.primary};
      }

      &[data-state="checked"] {
        background-color: ${theme.colors.background.surface};
        color: ${theme.colors.brand.cyan};
        box-shadow: ${theme.colors.effect.shadow.sm};
      }
    `}

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  ${({ theme }) => disabledState(theme)}
`;

const RadioIndicator = styled(RadioGroupPrimitive.Indicator)`
  ${flexCenter}
  width: ${({ theme }) => theme.sizes.component.radioIndicator};
  height: ${({ theme }) => theme.sizes.component.radioIndicator};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.brand.cyan};
`;

const RadioLabelContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["2xs"]};
  cursor: inherit;
`;

const LabelTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: inherit;
`;

const OptionDescription = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.secondary};
`;

const SegmentedLabel = styled.span`
  user-select: none;
`;

const IconSlot = styled.span`
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.secondary};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
  }
`;
