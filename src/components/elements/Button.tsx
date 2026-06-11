import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  type AppearanceVariant,
  type ComponentColor,
  type ControlSize,
  type ComponentShape,
  type Spacing,
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
  /** 버튼의 형태 (기본값: "solid") */
  variant?: AppearanceVariant;
  /** 버튼의 색상 (기본값: "primary") - 테마 토큰 및 Hex 문자열 지원 */
  color?: ComponentColor;
  /** 버튼 크기 (기본값: "md") */
  size?: ControlSize;
  /** 버튼 모양 (기본값: "square") */
  shape?: ComponentShape;
  /** 부모 컨테이너의 너비를 100% 채울지 여부 */
  fullWidth?: boolean;
  /** 로딩 상태 여부 */
  isLoading?: boolean;
  /** 텍스트 좌측에 배치할 아이콘 */
  leftIcon?: React.ReactNode;
  /** 텍스트 우측에 배치할 아이콘 */
  rightIcon?: React.ReactNode;
  /** 아이콘 전용 버튼 여부 (텍스트 숨김) */
  isIconOnly?: boolean;
  /** 아이콘 배치 방식 (inline: 텍스트 옆, edge: 양 끝단) */
  iconLayout?: IconLayout;
  /** 텍스트 정렬 */
  textAlign?: TextAlign;
  /** 아이콘과 텍스트 사이의 간격 */
  spacing?: Spacing;
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

// ==========================================
// Styled Components
// ==========================================

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

const StyledButton = styled.button<{
  $size: ControlSize;
  $variant: AppearanceVariant;
  $color: ComponentColor;
  $shape: ComponentShape;
  $fullWidth: boolean;
  $isIconOnly: boolean;
  $spacing?: Spacing;
  href?: string;
  target?: string;
}>`
  ${({ theme }) => inlineComponentBase(theme)};

  gap: ${({ theme, $spacing }) => {
    if (!$spacing) return theme.spacing.xs;
    return theme.spacing[$spacing] || $spacing;
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

  ${({ theme, $variant, $color }) =>
    componentColorStyle(theme, $variant, $color, true)};
`;
