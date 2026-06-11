import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  type AppearanceVariant,
  type ColorVariant,
  type ControlSize,
  type ComponentShape,
  type Spacing,
  type FontWeight,
  type FontSize,
} from "../../styles/types";
import {
  componentColorStyle,
  controlSizeBase,
  disabledState,
  focusRing,
  squareComponentSize,
  squareIconSize,
  transitionBase,
  inlineComponentBase,
  textEllipsis,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";
import { Spinner } from "../feedback/Spinner";

type IconLayout = "inline" | "edge";
type TextAlign = "left" | "center" | "right";

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "color"
> {
  as?: React.ElementType;
  href?: string;
  target?: string;
  variant?: AppearanceVariant;
  color?: ColorVariant;
  size?: ControlSize;
  shape?: ComponentShape;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isIconOnly?: boolean;
  iconLayout?: IconLayout;
  textAlign?: TextAlign;
  spacing?: Spacing;
  weight?: FontWeight;
  fontSize?: FontSize;
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
      variant = "solid",
      color = "default",
      size = "md",
      shape = "square",
      fullWidth = false,
      disabled = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      isIconOnly = false,
      iconLayout = "inline",
      textAlign = "center",
      spacing = "xs",
      weight = "medium",
      fontSize,
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
        $color={color}
        $size={size}
        $shape={shape}
        $fullWidth={fullWidth}
        $isIconOnly={isIconOnly}
        $spacing={spacing}
        $weight={weight}
        $fontSize={fontSize}
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
            {!isIconOnly && shape !== "circle" && (
              <ButtonTextWrapper $align={textAlign} $iconLayout={iconLayout}>
                {children}
              </ButtonTextWrapper>
            )}
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

const filterProps = {
  shouldForwardProp: (prop: string) =>
    ![
      "$variant",
      "$color",
      "$size",
      "$shape",
      "$fullWidth",
      "$isIconOnly",
      "$spacing",
      "$weight",
      "$fontSize",
    ].includes(prop),
};

const ButtonIconWrapper = styled.span<{ $size: ControlSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  & > svg {
    ${({ theme, $size }) => squareIconSize(theme, $size)}
  }
`;

const ButtonTextWrapper = styled.span<{
  $align: TextAlign;
  $iconLayout: IconLayout;
}>`
  flex: ${({ $iconLayout }) => ($iconLayout === "edge" ? 1 : undefined)};
  text-align: ${({ $align }) => $align};

  ${textEllipsis}
`;

const StyledButton = styled("button", filterProps)<{
  $size: ControlSize;
  $variant: AppearanceVariant;
  $color: ColorVariant;
  $shape: ComponentShape;
  $fullWidth: boolean;
  $isIconOnly: boolean;
  $spacing?: Spacing | string;
  $weight: FontWeight | string;
  $fontSize?: FontSize | string;
  href?: string;
  target?: string;
}>`
  ${({ theme }) => inlineComponentBase(theme)};

  gap: ${({ theme, $spacing }) => {
    if (!$spacing) return theme.spacing.xs;
    return theme.spacing[$spacing as keyof typeof theme.spacing] || $spacing;
  }};

  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ theme }) => transitionBase(theme)};
  ${({ theme }) => disabledState(theme)};

  &:focus-visible {
    ${({ theme }) => focusRing(theme)};
  }

  ${({ $size, $shape, $isIconOnly, $fontSize, theme }) => {
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
      ${controlSizeBase(theme, $size, $fontSize)}
      border-radius: ${theme.borderRadius.md};
    `;
  }}

  font-weight: ${({ theme, $weight }) =>
    theme.fontWeights[$weight as keyof typeof theme.fontWeights] || $weight};

  ${({ theme, $variant, $color }) =>
    componentColorStyle(theme, $variant, $color, true)};
`;
