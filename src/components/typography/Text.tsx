import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { textEllipsis, lineClamp } from "../../styles/mixins";
import {
  type FontSize,
  type FontWeight,
  type TextColorIntent,
  type TextAlign,
} from "../../styles/types";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColorIntent;
  align?: TextAlign;
  ellipsis?: boolean;
  clamp?: number;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = "span",
      size = "base",
      weight = "regular",
      color = "primary",
      align = "left",
      ellipsis = true,
      clamp,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledText
        as={as}
        ref={ref}
        $size={size}
        $weight={weight}
        $color={color}
        $align={align}
        $ellipsis={ellipsis}
        $clamp={clamp}
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
    !["$size", "$weight", "$color", "$align", "$ellipsis", "$clamp"].includes(
      prop,
    ),
};

const StyledText = styled("span", filterProps)<{
  $size: FontSize;
  $weight: FontWeight;
  $color: TextColorIntent;
  $align: TextAlign;
  $ellipsis: boolean;
  $clamp?: number;
}>`
  margin: 0;
  padding: 0;
  text-align: ${({ $align }) => $align};

  font-size: ${({ theme, $size }) => theme.fontSizes[$size]};
  font-weight: ${({ theme, $weight }) => theme.fontWeights[$weight]};

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
