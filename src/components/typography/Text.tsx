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

export interface TextProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> {
  as?: React.ElementType;
  variant?: TextVariant;
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColorIntent | (string & {});
  align?: TextAlign;
  ellipsis?: boolean;
  clamp?: number;
  isInlineToken?: boolean;
  fullWidth?: boolean;
}

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

// 💡 weight의 굴레를 벗어던지고, 오직 '기본 크기'만 제안하는 가벼운 매핑
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
  $color: TextColorIntent | (string & {});
  $align: TextAlign;
  $ellipsis: boolean;
  $clamp?: number;
  $isInlineToken: boolean;
  $fullWidth: boolean;
}>`
  margin: 0;
  padding: 0;
  text-align: ${({ $align }) => $align};
  white-space: ${({ $ellipsis }) => ($ellipsis ? undefined : "pre-wrap")};

  ${({ theme, $variant, $size, $weight }) => {
    // 💡 크기는 명시된 사이즈 > Variant 기본 사이즈 > base 순서로 적용
    const finalSize = $size || ($variant ? variantSizeMap[$variant] : "base");

    // 💡 굵기는 더 이상 Variant의 눈치를 보지 않습니다. 명시 안 하면 무조건 regular!
    const finalWeight = $weight || "regular";

    return css`
      font-size: ${theme.fontSizes[finalSize]};
      font-weight: ${theme.fontWeights[finalWeight]};
    `;
  }}

  /* 텍스트 컬러 처리 (단색) */
  color: ${({ theme, $color }) => {
    const colorStr = $color as string;

    if (colorStr === "brand") {
      return theme.colors.brand.gradient
        ? "transparent"
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
