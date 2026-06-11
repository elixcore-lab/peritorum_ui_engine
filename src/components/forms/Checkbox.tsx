import React, { CSSProperties, forwardRef } from "react";
import * as CheckBoxPrimitive from "@radix-ui/react-checkbox";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Check, Minus } from "lucide-react";
import {
  type SelectionVariant,
  type SelectionValue,
  Spacing,
} from "../../styles/types";
import {
  flexCenter,
  focusRing,
  transitionBase,
  disabledState,
  squareIconSize,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";
import { Spinner } from "../feedback/Spinner";

/**
 * CheckBoxGroup에서 렌더링할 단일 체크 옵션 모델입니다.
 */
export interface CheckBoxOption {
  label: string;
  value: SelectionValue;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * 단일 CheckBox의 라벨, 설명, 상태, 선택값, 변경 콜백을 정의합니다.
 *
 * Radix Checkbox Root 속성을 상속하되 checked/onChange/value는 디자인 시스템 API로
 * 재정의합니다.
 */
export interface CheckBoxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckBoxPrimitive.Root>,
  "asChild" | "checked" | "children" | "onChange" | "style" | "value"
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

/**
 * 여러 CheckBox를 하나의 값 배열로 제어하기 위한 group props입니다.
 *
 * 간격은 theme spacing token 또는 token 기반 계산값으로 처리합니다.
 */
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
  gap?: Spacing | number;
}

/**
 * boolean 또는 indeterminate 상태를 표시하는 Radix 기반 checkbox 컴포넌트입니다.
 */
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
      <CheckBoxWrapper
        htmlFor={domId}
        className={className}
        $variant={variant}
        data-disabled={trulyDisabled ? "" : undefined}
      >
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
              <Spinner size="xs" color="currentColor" />
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
              <CheckBoxTitle $disabled={trulyDisabled}>{label}</CheckBoxTitle>
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

/**
 * 여러 checkbox 옵션을 배열 값으로 제어하는 group 컴포넌트입니다.
 */
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

// ==========================================
// Styled Components
// ==========================================

const groupFilter = {
  shouldForwardProp: (prop: string) => !["$direction", "$gap"].includes(prop),
};
const wrapperFilter = {
  shouldForwardProp: (prop: string) => !["$variant"].includes(prop),
};
const checkboxFilter = {
  shouldForwardProp: (prop: string) => !["$isError", "$variant"].includes(prop),
};

const CheckBoxGroupRoot = styled("div", groupFilter)<{
  $direction: CSSProperties["flexDirection"];
  $gap?: Spacing | number;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};

  gap: ${({ theme, $gap }) => {
    if (!$gap) return theme.spacing.sm;
    if (typeof $gap === "number") {
      return `calc(${theme.sizes.component.dividerThin} * ${$gap})`;
    }
    return theme.spacing[$gap as keyof typeof theme.spacing] || $gap;
  }};
`;

const CheckBoxWrapper = styled("label", wrapperFilter)<{
  $variant: SelectionVariant;
}>`
  display: inline-flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${({ theme, $variant }) =>
    $variant === "card" &&
    css`
      flex: 1;
      padding: ${theme.spacing.md};
      border: ${theme.sizes.component.dividerThin} solid
        ${theme.colors.border.strong};
      border-radius: ${theme.borderRadius.md};
      background-color: ${theme.colors.background.surface};
      ${transitionBase(theme)}

      &:hover:not([data-disabled]) {
        border-color: ${theme.colors.brand.cyan || theme.colors.brand.primary};
        background-color: ${theme.colors.background.hover};
      }

      &:has([data-state="checked"]),
      &:has([data-state="indeterminate"]) {
        border-color: ${theme.colors.brand.cyan || theme.colors.brand.primary};
        background-color: ${theme.colors.statusBg.info};
      }
    `}
`;

const StyledCheckBox = styled(CheckBoxPrimitive.Root, checkboxFilter)<{
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

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled):not([data-disabled]) {
    border-color: ${({ theme }) =>
      theme.colors.brand.cyan || theme.colors.brand.primary};
  }

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-state="checked"],
  &[data-state="indeterminate"] {
    background-color: ${({ theme }) =>
      theme.colors.brand.cyan || theme.colors.brand.primary};
    border-color: ${({ theme }) =>
      theme.colors.brand.cyan || theme.colors.brand.primary};
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
  gap: ${({ theme }) => theme.spacing["2xs"]};
  cursor: inherit;
`;

const CheckBoxTitle = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.primary};
`;

const CheckBoxDescription = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.secondary};
`;
