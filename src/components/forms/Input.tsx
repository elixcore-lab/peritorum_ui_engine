import React, { forwardRef, useState } from "react";
import styled from "@emotion/styled";
import { css, type Theme } from "@emotion/react";
import { XCircle, Eye, EyeOff, Check } from "lucide-react";
import { useUiConfig } from "../../ConfigProvider";
import { type ControlSize } from "../../styles/types";
import {
  flexCenter,
  formControlBase,
  resetButton,
  controlSizeBase,
  squareIconSize,
  interactiveTextColor,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";
import { Spinner } from "../feedback/Spinner";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  size?: ControlSize;
  isError?: boolean;
  isSuccess?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const getSizeStyle = (
  theme: Theme,
  size: ControlSize,
  hasLeftIcon: boolean,
  rightIconCount: number,
) => {
  const basePadding =
    {
      xs: theme.spacing.sm,
      sm: theme.spacing.base,
      md: theme.spacing.md,
      lg: theme.spacing.md,
      xl: theme.spacing.lg,
    }[size] || theme.spacing.md;
  const iconInset = theme.sizes.control[size];
  const paddingLeft = hasLeftIcon ? iconInset : basePadding;

  let paddingRight = basePadding;

  if (rightIconCount === 1) {
    paddingRight = iconInset;
  } else if (rightIconCount > 1) {
    paddingRight = `calc(${iconInset} + (${rightIconCount - 1} * ${theme.spacing.lg}))`;
  }

  return css`
    padding-left: ${paddingLeft};
    padding-right: ${paddingRight};
  `;
};

const filterProps = {
  shouldForwardProp: (prop: string) =>
    ![
      "$inputSize",
      "$isError",
      "$isSuccess",
      "$hasLeftIcon",
      "$rightIconCount",
      "$hasAddonBefore",
      "$hasAddonAfter",
    ].includes(prop),
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      isError = false,
      isSuccess = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      addonBefore,
      addonAfter,
      clearable,
      disabled,
      onClear,
      type,
      value,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    const isPasswordType = type === "password";
    const actualType = isPasswordType
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

    const hasValue =
      value !== undefined && value !== null && String(value).length > 0;
    const showClearBtn = clearable && hasValue && !trulyDisabled;

    let rightIconCount = 0;
    if (rightIcon) rightIconCount++;
    if (showClearBtn) rightIconCount++;
    if (isPasswordType) rightIconCount++;
    if (isLoading || isSuccess) rightIconCount++;

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = rightIconCount > 0;
    const needsInnerWrapper = hasLeftIcon || hasRightIcon;
    const needsOuterWrapper = !!addonBefore || !!addonAfter;

    const inputPresentationProps =
      !needsInnerWrapper && !needsOuterWrapper ? { className, style } : {};
    const innerWrapperPresentationProps = !needsOuterWrapper
      ? { className, style }
      : {};
    const outerWrapperPresentationProps = needsOuterWrapper
      ? { className, style }
      : {};

    const inputElement = (
      <StyledInput
        ref={ref}
        type={actualType}
        value={value}
        $inputSize={size}
        $isError={isError}
        $isSuccess={isSuccess}
        $hasLeftIcon={hasLeftIcon}
        $rightIconCount={rightIconCount}
        $hasAddonBefore={!!addonBefore}
        $hasAddonAfter={!!addonAfter}
        disabled={trulyDisabled}
        data-disabled={trulyDisabled ? "" : undefined}
        aria-invalid={isError}
        aria-busy={isLoading}
        {...inputPresentationProps}
        {...props}
      />
    );

    let content = inputElement;

    if (needsInnerWrapper) {
      content = (
        <InputWrapper {...innerWrapperPresentationProps}>
          {hasLeftIcon && (
            <IconWrapper
              $position="left"
              $isError={isError}
              $isSuccess={isSuccess}
              $disabled={trulyDisabled}
            >
              {leftIcon}
            </IconWrapper>
          )}
          {inputElement}
          {hasRightIcon && (
            <IconWrapper
              $position="right"
              $isError={isError}
              $isSuccess={isSuccess}
              $interactive
              $disabled={trulyDisabled}
            >
              {showClearBtn && (
                <ActionButton
                  type="button"
                  onClick={onClear}
                  aria-label={t("ui.component.input.clear")}
                  tabIndex={-1}
                >
                  <ActionIconWrapper>
                    <XCircle />
                  </ActionIconWrapper>
                </ActionButton>
              )}
              {isPasswordType && (
                <ActionButton
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  aria-label={
                    isPasswordVisible
                      ? t("ui.component.input.hidePassword")
                      : t("ui.component.input.showPassword")
                  }
                >
                  <ActionIconWrapper>
                    {isPasswordVisible ? <EyeOff /> : <Eye />}
                  </ActionIconWrapper>
                </ActionButton>
              )}
              {rightIcon && <ActionIconWrapper>{rightIcon}</ActionIconWrapper>}
              {isLoading && (
                <ActionIconWrapper>
                  <Spinner size="sm" />
                </ActionIconWrapper>
              )}
              {isSuccess && !isLoading && (
                <ActionIconWrapper>
                  <Check />
                </ActionIconWrapper>
              )}
            </IconWrapper>
          )}
        </InputWrapper>
      );
    }

    if (!needsOuterWrapper) return content;

    return (
      <OuterWrapper {...outerWrapperPresentationProps}>
        {addonBefore && <Addon $position="before">{addonBefore}</Addon>}
        {content}
        {addonAfter && <Addon $position="after">{addonAfter}</Addon>}
      </OuterWrapper>
    );
  },
);

Input.displayName = "Input";

const OuterWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Addon = styled.div<{ $position: "before" | "after" }>`
  display: inline-flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.strong};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  white-space: nowrap;

  ${({ $position, theme }) =>
    $position === "before"
      ? css`
          border-right: none;
          border-top-left-radius: ${theme.borderRadius.md};
          border-bottom-left-radius: ${theme.borderRadius.md};
        `
      : css`
          border-left: none;
          border-top-right-radius: ${theme.borderRadius.md};
          border-bottom-right-radius: ${theme.borderRadius.md};
        `}
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
`;

const IconWrapper = styled.div<{
  $position: "left" | "right";
  $isError?: boolean;
  $isSuccess?: boolean;
  $interactive?: boolean;
  $disabled?: boolean;
}>`
  position: absolute;
  ${flexCenter}
  gap: ${({ theme }) => theme.spacing.sm};

  pointer-events: ${({ $interactive, $disabled }) =>
    $interactive && !$disabled ? "auto" : "none"};

  ${({ $position, theme }) =>
    $position === "left"
      ? `left: ${theme.spacing.base};`
      : `right: ${theme.spacing.base};`}

  color: ${({ theme, $isError, $isSuccess, $disabled }) =>
    $disabled
      ? theme.colors.text.disabled
      : $isError
        ? theme.colors.status.danger
        : $isSuccess
          ? theme.colors.status.success
          : theme.colors.text.secondary};
  z-index: 1;
`;

const ActionButton = styled.button`
  ${resetButton}
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.disabled};

  ${({ theme }) => interactiveTextColor(theme)}

  &:focus-visible {
    outline: none;
    color: ${({ theme }) => theme.colors.brand.cyan};
  }
`;

const ActionIconWrapper = styled.span`
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
  }
`;

const StyledInput = styled("input", filterProps)<{
  $inputSize: ControlSize;
  $isError?: boolean;
  $isSuccess?: boolean;
  $hasLeftIcon: boolean;
  $rightIconCount: number;
  $hasAddonBefore: boolean;
  $hasAddonAfter: boolean;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}
  ${({ theme, $inputSize }) => controlSizeBase(theme, $inputSize)}

  ${({ theme, $isSuccess, $isError }) =>
    $isSuccess &&
    !$isError &&
    css`
      border-color: ${theme.colors.status.success};
      &:hover:not(:disabled) {
        border-color: ${theme.colors.status.success};
      }
      &:focus,
      &:focus-within {
        border-color: ${theme.colors.status.success};
        box-shadow: 0 0 0 ${theme.sizes.component.dividerMedium}
          ${theme.colors.statusBg.success};
      }
    `}

  ${({ theme, $inputSize, $hasLeftIcon, $rightIconCount }) =>
    getSizeStyle(theme, $inputSize, $hasLeftIcon, $rightIconCount)}

  ${({ $hasAddonBefore }) =>
    $hasAddonBefore &&
    css`
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    `}

  ${({ $hasAddonAfter }) =>
    $hasAddonAfter &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;
