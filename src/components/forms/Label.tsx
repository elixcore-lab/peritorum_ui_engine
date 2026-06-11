import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { resolveDisabled } from "../../utils";
import { applyTransition, resolveThemeColor } from "../../styles/mixins";
import {
  type FontSize,
  type FontWeight,
  type ColorVariant,
} from "../../styles/types";

/**
 * Label의 필수 표시, disabled 상태, 타이포그래피/색상 토큰을 정의합니다.
 *
 * 표준 label 속성을 상속하며, 크기와 색상은 디자인 시스템 token을 우선 사용합니다.
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  /** theme font size 토큰입니다. */
  size?: FontSize;
  /** theme font weight 토큰입니다. */
  weight?: FontWeight;
  /** theme color intent 또는 currentColor입니다. */
  color?: ColorVariant | "currentColor";
}

/**
 * form control과 연결되는 기본 label 컴포넌트입니다.
 *
 * required mark와 disabled 색상 처리를 내장하고, spacing은 내부 gap만 사용합니다.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      required,
      disabled,
      size = "sm",
      weight = "medium",
      color = "primary",
      ...props
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled });

    return (
      <StyledLabel
        ref={ref}
        $size={size}
        $weight={weight}
        $color={color}
        data-disabled={trulyDisabled ? "" : undefined}
        {...props}
      >
        {children}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
      </StyledLabel>
    );
  },
);

Label.displayName = "Label";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$size", "$weight", "$color"].includes(prop),
};

const StyledLabel = styled("label", filterProps)<{
  $size: FontSize | (string & {});
  $weight: FontWeight | (number & {});
  $color: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  font-size: ${({ theme, $size }) =>
    theme.fontSizes[$size as keyof typeof theme.fontSizes] || $size};

  font-weight: ${({ theme, $weight }) =>
    theme.fontWeights[$weight as keyof typeof theme.fontWeights] || $weight};

  color: ${({ theme, $color }) => {
    if ($color === "currentColor" || $color === "inherit") return $color;
    if ($color === "primary") return theme.colors.text.primary;
    if ($color === "secondary") return theme.colors.text.secondary;

    return resolveThemeColor(theme, $color);
  }};

  cursor: pointer;
  user-select: none;

  ${({ theme }) => applyTransition(theme, "color")}

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.status.danger};
`;
