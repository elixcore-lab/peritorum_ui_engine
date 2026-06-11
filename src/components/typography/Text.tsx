import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  textEllipsis,
  lineClamp,
  textGradientStyle,
} from "../../styles/mixins";
import {
  type FontSize,
  type FontWeight,
  type TextColorIntent,
  type TextAlign,
} from "../../styles/types";

export type TextVariant = "h1" | "h2" | "h3" | "body1" | "body2" | "caption";

/**
 * Text 컴포넌트가 지원하는 시맨틱 태그, 타이포그래피 토큰, 줄임 옵션을 정의합니다.
 *
 * `variant`, `size`, `weight`, `color`는 theme 기반 토큰을 우선 사용하며,
 * 컴포넌트 간 간격은 Text 자체가 아니라 상위 Layout의 gap/padding으로 제어합니다.
 */
export interface TextProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color" | "style"
> {
  as?: React.ElementType;
  variant?: TextVariant;
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColorIntent;
  align?: TextAlign;
  ellipsis?: boolean;
  clamp?: number;
  isInlineToken?: boolean;
  fullWidth?: boolean;
}

/**
 * 디자인 시스템 전역에서 사용하는 기본 타이포그래피 컴포넌트입니다.
 *
 * 제목, 본문, 캡션, 단일 라인 말줄임, 멀티 라인 클램프를 하나의 API로 제공하며
 * ref와 표준 HTML 속성을 그대로 전달할 수 있습니다.
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as,
      variant,
      size,
      weight,
      color = "primary",
      align = "left",
      ellipsis = false,
      clamp,
      isInlineToken = false,
      fullWidth = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Component = (as ||
      (variant && ["h1", "h2", "h3"].includes(variant)
        ? variant
        : "span")) as React.ElementType;

    return (
      <StyledText
        as={Component}
        ref={ref}
        $variant={variant}
        $size={size}
        $weight={weight}
        $color={color}
        $align={align}
        $ellipsis={ellipsis}
        $clamp={clamp}
        $isInlineToken={isInlineToken}
        $fullWidth={fullWidth}
        {...props}
      >
        {children}
      </StyledText>
    );
  },
);

Text.displayName = "Text";

const filterProps = {
  shouldForwardProp: (prop: string) =>
    ![
      "$variant",
      "$size",
      "$weight",
      "$color",
      "$align",
      "$ellipsis",
      "$clamp",
      "$isInlineToken",
      "$fullWidth",
    ].includes(prop),
};

const variantSizeMap: Record<TextVariant, FontSize> = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  body1: "base",
  body2: "sm",
  caption: "xs",
};

// ==========================================
// Styled Components
// ==========================================

const StyledText = styled("span", filterProps)<{
  $variant?: TextVariant;
  $size?: FontSize;
  $weight?: FontWeight;
  $color: TextColorIntent;
  $align: TextAlign;
  $ellipsis: boolean;
  $clamp?: number;
  $isInlineToken: boolean;
  $fullWidth: boolean;
}>`
  padding: ${({ theme }) => theme.spacing.none};
  text-align: ${({ $align }) => $align};
  white-space: ${({ $ellipsis }) => ($ellipsis ? undefined : "pre-wrap")};

  ${({ theme, $variant, $size, $weight }) => {
    const finalSize = $size || ($variant ? variantSizeMap[$variant] : "base");
    const finalWeight = $weight || "regular";

    return css`
      font-size: ${theme.fontSizes[finalSize as keyof typeof theme.fontSizes] ||
      finalSize};

      font-weight: ${theme.fontWeights[
        finalWeight as keyof typeof theme.fontWeights
      ] || finalWeight};
    `;
  }}

  /* 텍스트 컬러 처리 (단색) */
  color: ${({ theme, $color }) => {
    const colorStr = $color as string;

    if (colorStr === "brand") {
      return theme.colors.brand.gradient
        ? theme.colors.utility.transparent
        : theme.colors.brand.cyan || theme.colors.brand.primary;
    }

    if (["white", "black", "inherit"].includes(colorStr)) return colorStr;

    if (["danger", "success", "warning", "info"].includes(colorStr)) {
      return theme.colors.status[
        colorStr as "danger" | "success" | "warning" | "info"
      ];
    }

    const textColors = theme.colors.text as Record<string, string>;
    if (textColors[colorStr]) return textColors[colorStr];

    return colorStr;
  }};

  /* 그라데이션 자동화 로직 */
  ${({ theme, $color }) => {
    if ($color === "brand" && theme.colors.brand.gradient) {
      return textGradientStyle(theme.colors.brand.gradient);
    }
    return "";
  }}

  width: ${({ $fullWidth, $ellipsis }) =>
    $fullWidth || $ellipsis ? "100%" : "fit-content"};

  ${({ $ellipsis }) =>
    $ellipsis &&
    css`
      display: block;
      ${textEllipsis}
    `}

  word-break: ${({ $ellipsis }) => ($ellipsis ? undefined : "auto-phrase")};
  ${({ $clamp }) => $clamp && lineClamp($clamp)}
`;
