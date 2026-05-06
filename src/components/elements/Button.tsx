import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  controlDisabledStyle,
  focusRing,
  squareComponentSize,
  transitionBase,
  transparentBorder,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "warning";
  size?: "sm" | "md" | "lg";
  shape?: "square" | "circle";
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      shape = "square",
      isFullWidth,
      isDisabled,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const resolvedDisabled = resolveDisabled({ isDisabled });

    return (
      <StyledButton
        ref={ref}
        $variant={variant}
        $size={size}
        $shape={shape}
        $fullWidth={isFullWidth}
        disabled={resolvedDisabled || isLoading}
        {...props}
      >
        {isLoading ? t("common.loading") : children}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";

// --- Styled Components ---

const StyledButton = styled.button<{
  $variant: NonNullable<ButtonProps["variant"]>;
  $size: NonNullable<ButtonProps["size"]>;
  $shape: NonNullable<ButtonProps["shape"]>;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  ${({ theme }) => transparentBorder(theme)}
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  user-select: none;

  ${({ theme }) => transitionBase(theme)}

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
  }

  &:disabled {
    ${({ theme }) => controlDisabledStyle(theme)}
  }

  ${({ $size, $shape, theme }) => {
    if ($shape === "circle") {
      return css`
        ${squareComponentSize(theme, $size)}
        border-radius: ${theme.borderRadius.round};
        padding: 0;
      `;
    }
    const paddingMap = {
      sm: `0 ${theme.spacing.sm}`,
      md: `0 ${theme.spacing.base}`,
      lg: `0 ${theme.spacing.lg}`,
    };
    const fontSizeMap = {
      sm: theme.fontSizes.sm,
      md: theme.fontSizes.base,
      lg: theme.fontSizes.lg,
    };

    return css`
      height: ${theme.sizes.control[$size]};
      padding: ${paddingMap[$size]};
      font-size: ${fontSizeMap[$size]};
      border-radius: ${theme.borderRadius.md};
    `;
  }}

  /* Variant 스타일링 */
  ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background-color: ${theme.colors.utility.transparent};
          border-color: ${theme.colors.border.strong};
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.hover};
          }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.status.danger};
          color: ${theme.colors.text.inverse};
          &:hover:not(:disabled) {
            filter: brightness(0.9);
          }
        `;
      case "warning":
        return css`
          background-color: ${theme.colors.status.warning};
          color: ${theme.colors.text.inverse};
          &:hover:not(:disabled) {
            filter: brightness(0.9);
          }
        `;
      case "ghost":
        return css`
          background-color: ${theme.colors.utility.transparent};
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.background.hover};
          }
        `;
      case "primary":
      default:
        return css`
          background-color: ${theme.colors.brand.primary};
          color: ${theme.colors.text.inverse};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.brand.primaryHover};
          }
        `;
    }
  }}
`;
