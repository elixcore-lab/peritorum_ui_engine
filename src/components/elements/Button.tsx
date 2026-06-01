import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  type ColorVariant,
  type ControlSize,
  type ComponentShape,
} from "../../styles/types";
import {
  solidVariantStyle,
  controlSizeBase,
  disabledState,
  focusRing,
  squareComponentSize,
  squareIconSize,
  transitionBase,
  inlineComponentBase,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";
import { Spinner } from "../feedback/Spinner";

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  as?: React.ElementType;
  href?: string;
  target?: string;
  variant?: ColorVariant;
  size?: ControlSize;
  shape?: ComponentShape;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isIconOnly?: boolean;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      as,
      href,
      children,
      variant = "primary",
      size = "md",
      shape = "square",
      fullWidth = false,
      disabled = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      isIconOnly = false,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    const Component = as || (href ? "a" : "button");
    const isAnchor =
      Component === "a" ||
      (typeof Component === "string" && Component !== "button");

    const handleAnchorClick = (
      e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    ) => {
      if (trulyDisabled) e.preventDefault();
      if (props.onClick)
        props.onClick(e as React.MouseEvent<HTMLButtonElement>);
    };

    return (
      <StyledButton
        as={Component}
        ref={ref as React.ForwardedRef<HTMLButtonElement & HTMLAnchorElement>}
        href={href}
        $variant={variant}
        $size={size}
        $shape={shape}
        $fullWidth={fullWidth}
        $isIconOnly={isIconOnly}
        disabled={!isAnchor ? trulyDisabled : undefined}
        data-disabled={trulyDisabled ? "" : undefined}
        aria-disabled={trulyDisabled}
        aria-busy={isLoading}
        onClick={isAnchor ? handleAnchorClick : props.onClick}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size={size === "lg" ? "md" : "sm"} color="currentColor" />
            {!isIconOnly && shape !== "circle" && (
              <span>{t("common.loading")}</span>
            )}
          </>
        ) : (
          <>
            {leftIcon && (
              <ButtonIconWrapper $size={size}>{leftIcon}</ButtonIconWrapper>
            )}
            {typeof children === "string" ? <span>{children}</span> : children}
            {rightIcon && (
              <ButtonIconWrapper $size={size}>{rightIcon}</ButtonIconWrapper>
            )}
          </>
        )}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";

const ButtonIconWrapper = styled.span<{ $size: ControlSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  & > svg {
    ${({ theme, $size }) => squareIconSize(theme, $size)}
  }
`;

const StyledButton = styled.button<{
  $size: ControlSize;
  $variant: ColorVariant;
  $shape: ComponentShape;
  $fullWidth: boolean;
  $isIconOnly: boolean;
  href?: string;
  target?: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  & > * {
    line-height: 1 !important;
  }

  ${({ theme }) => inlineComponentBase(theme)};
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ theme }) => transitionBase(theme)}
  ${({ theme }) => disabledState(theme)}

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
  }

  ${({ $size, $shape, $isIconOnly, theme }) => {
    if ($shape === "circle" || $isIconOnly) {
      return css`
        ${squareComponentSize(theme, $size)}
        border-radius: ${$shape === "circle"
          ? theme.borderRadius.round
          : theme.borderRadius.md};
        padding: 0;
      `;
    }
    return css`
      ${controlSizeBase(theme, $size)}
      border-radius: ${theme.borderRadius.md};
    `;
  }}

  ${({ $variant, theme }) => solidVariantStyle(theme, $variant)}
`;
