import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { textEllipsis, lineClamp } from "../../styles/mixins";
import {
  type FontSize,
  type FontWeight,
  type TextColorIntent,
  type TextAlign,
} from "../../styles/types";

export type TextVariant = "h1" | "h2" | "h3" | "body1" | "body2" | "caption";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColorIntent;
  align?: TextAlign;
  ellipsis?: boolean;
  clamp?: number;
  isInlineToken?: boolean;
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
      ellipsis = true,
      clamp,
      isInlineToken = false,
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
    ].includes(prop),
};

// Variant와 디자인 토큰을 연결하는 선언적 매핑 객체
const variantMap: Record<TextVariant, { size: FontSize; weight: FontWeight }> =
  {
    h1: { size: "4xl", weight: "bold" },
    h2: { size: "3xl", weight: "bold" },
    h3: { size: "2xl", weight: "bold" },
    body1: { size: "base", weight: "regular" },
    body2: { size: "sm", weight: "regular" },
    caption: { size: "xs", weight: "regular" },
  };

const StyledText = styled("span", filterProps)<{
  $variant?: TextVariant;
  $size?: FontSize;
  $weight?: FontWeight;
  $color: TextColorIntent;
  $align: TextAlign;
  $ellipsis: boolean;
  $clamp?: number;
  $isInlineToken: boolean;
}>`
  margin: 0;
  padding: 0;
  text-align: ${({ $align }) => $align};

  ${({ theme, $variant, $size, $weight }) => {
    // Variant에 매핑된 기본 설정값을 가져옵니다.
    const defaultToken = $variant ? variantMap[$variant] : null;

    // 명시적 Prop($size, $weight)이 있으면 최우선 적용, 없으면 Variant 설정, 다 없으면 기본값
    const finalSize = $size || defaultToken?.size || "base";
    const finalWeight = $weight || defaultToken?.weight || "regular";

    return css`
      font-size: ${theme.fontSizes[finalSize]};
      font-weight: ${theme.fontWeights[finalWeight]};
    `;
  }}

  line-height: ${({ $isInlineToken, $variant, $size }) => {
    if ($isInlineToken) return 1;

    // 폰트 사이즈에 맞춰 황금 비율의 line-height를 동적으로 계산합니다.
    const finalSize = $size || ($variant ? variantMap[$variant]?.size : "base");

    if (finalSize && ["3xl", "4xl", "5xl"].includes(finalSize)) return 1.2;
    if (finalSize && ["xl", "2xl"].includes(finalSize)) return 1.3;
    return 1.5;
  }};

  color: ${({ theme, $color }) => {
    switch ($color) {
      case "inherit":
        return "inherit";
      case "brand":
        return theme.colors.brand.primary;
      case "danger":
      case "success":
      case "warning":
      case "info":
        return theme.colors.status[$color];
      default:
        return theme.colors.text[$color];
    }
  }};

  ${({ $ellipsis }) => $ellipsis && textEllipsis}
  ${({ $clamp }) => $clamp && lineClamp($clamp)}
`;
