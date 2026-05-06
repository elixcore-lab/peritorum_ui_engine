import React, { forwardRef, useState } from "react";
import styled from "@emotion/styled";
import { css, type Theme } from "@emotion/react";
import { XCircle, Eye, EyeOff } from "lucide-react";
import { useUiConfig } from "../../ConfigProvider";
import {
  applyTransition,
  controlBorder,
  controlDisabledStyle,
  flexCenter,
  focusRing,
  resetButton,
  transitionBase,
} from "../../styles";
import { resolveDisabled } from "../../utils";

// --- Types ---

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "disabled" | "size"
> {
  size?: "sm" | "md" | "lg";
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  isDisabled?: boolean;
  onClear?: () => void;
}

const getSizeStyle = (
  theme: Theme,
  size: Required<InputProps>["size"],
  hasLeftIcon: boolean,
  hasRightIcon: boolean,
  rightIconCount: number,
) => {
  const iconInset = {
    sm: theme.sizes.control.sm,
    md: `calc(${theme.sizes.control.md} - ${theme.spacing.xs})`,
    lg: `calc(${theme.sizes.control.lg} - ${theme.spacing.sm})`,
  }[size];
  const sizeConfig = {
    sm: {
      height: theme.sizes.control.sm,
      fontSize: theme.fontSizes.xs,
      basePadding: theme.spacing.base,
    },
    md: {
      height: theme.sizes.control.md,
      fontSize: theme.fontSizes.sm,
      basePadding: theme.spacing.md,
    },
    lg: {
      height: theme.sizes.control.lg,
      fontSize: theme.fontSizes.base,
      basePadding: theme.spacing.md,
    },
  };

  const { height, fontSize, basePadding } = sizeConfig[size];
  const paddingLeft = hasLeftIcon ? iconInset : basePadding;
  const extraRightIconSpacing = Array.from({
    length: Math.max(0, rightIconCount - 1),
  })
    .map(() => theme.spacing.lg)
    .join(" + ");
  const paddingRight =
    rightIconCount > 0
      ? extraRightIconSpacing
        ? `calc(${iconInset} + ${extraRightIconSpacing})`
        : iconInset
      : basePadding;

  return css`
    height: ${height};
    font-size: ${fontSize};
    padding: 0 ${paddingRight} 0 ${paddingLeft};
  `;
};

const filterProps = {
  shouldForwardProp: (prop: string) =>
    ![
      "$inputSize",
      "$isError",
      "$hasLeftIcon",
      "$hasRightIcon",
      "$rightIconCount",
    ].includes(prop),
};

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.div<{
  $position: "left" | "right";
  $isError?: boolean;
  $interactive?: boolean;
}>`
  position: absolute;
  ${flexCenter}
  gap: ${({ theme }) => theme.spacing.sm};
  pointer-events: ${({ $interactive }) => ($interactive ? "auto" : "none")};
  ${({ $position, theme }) =>
    $position === "left"
      ? `left: ${theme.spacing.base};`
      : `right: ${theme.spacing.base};`}

  color: ${({ theme, $isError }) =>
    $isError ? theme.colors.status.danger : theme.colors.text.secondary};
  z-index: 1;
`;

const ActionButton = styled.button`
  ${resetButton}
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.disabled};
  ${({ theme }) =>
    applyTransition(
      theme,
      "color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ActionIcon = styled.svg`
  width: ${({ theme }) => theme.sizes.icon.sm};
  height: ${({ theme }) => theme.sizes.icon.sm};
`;

const NonInteractiveIconContent = styled.div`
  pointer-events: none;
`;

const StyledInput = styled("input", filterProps)<{
  $inputSize: "sm" | "md" | "lg";
  $isError?: boolean;
  $hasLeftIcon: boolean;
  $hasRightIcon: boolean;
  $rightIconCount: number;
}>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.input};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;

  ${({ theme, $isError }) => controlBorder(theme, $isError)}

  ${({ theme }) => transitionBase(theme)}

  ${({ theme, $inputSize, $hasLeftIcon, $hasRightIcon, $rightIconCount }) =>
    getSizeStyle(
      theme,
      $inputSize,
      $hasLeftIcon,
      $hasRightIcon,
      $rightIconCount,
    )}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.brand.cyan};
  }

  &:focus {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &:disabled {
    ${({ theme }) => controlDisabledStyle(theme)}
  }
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      isError = false,
      leftIcon,
      rightIcon,
      clearable,
      isDisabled,
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
    const resolvedDisabled = resolveDisabled({ isDisabled });

    const isPasswordType = type === "password";
    const actualType = isPasswordType
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

    const hasValue =
      value !== undefined && value !== null && String(value).length > 0;
    const showClearBtn = clearable && hasValue;

    let rightIconCount = 0;
    if (rightIcon) rightIconCount++;
    if (showClearBtn) rightIconCount++;
    if (isPasswordType) rightIconCount++;

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = rightIconCount > 0;
    const needsWrapper = hasLeftIcon || hasRightIcon;
    const inputPresentationProps = !needsWrapper ? { className, style } : {};
    const wrapperPresentationProps = { className, style };

    const inputElement = (
      <StyledInput
        ref={ref}
        type={actualType}
        value={value}
        $inputSize={size}
        $isError={isError}
        $hasLeftIcon={hasLeftIcon}
        $hasRightIcon={hasRightIcon}
        $rightIconCount={rightIconCount}
        disabled={resolvedDisabled}
        {...inputPresentationProps}
        {...props}
      />
    );

    if (!needsWrapper) return inputElement;

    return (
      <InputWrapper {...wrapperPresentationProps}>
        {hasLeftIcon && (
          <IconWrapper $position="left" $isError={isError}>
            {leftIcon}
          </IconWrapper>
        )}
        {inputElement}
        {hasRightIcon && (
          <IconWrapper $position="right" $isError={isError} $interactive>
            {showClearBtn && (
              <ActionButton
                type="button"
                onClick={onClear}
                aria-label={t("ui.component.input.clear")}
              >
                <ActionIcon as={XCircle} />
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
                {isPasswordVisible ? (
                  <ActionIcon as={EyeOff} />
                ) : (
                  <ActionIcon as={Eye} />
                )}
              </ActionButton>
            )}
            {rightIcon && (
              <NonInteractiveIconContent>{rightIcon}</NonInteractiveIconContent>
            )}
          </IconWrapper>
        )}
      </InputWrapper>
    );
  },
);

Input.displayName = "Input";
