import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { resolveDisabled } from "../../utils";
import { applyTransition, resolveThemeColor } from "../../styles/mixins";
import {
  type FontSize,
  type FontWeight,
  type ColorVariant,
} from "../../styles/types";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
  /** 테마 토큰("sm", "lg") 또는 커스텀 픽셀("14px") 허용 */
  size?: FontSize;
  /** 테마 토큰("medium", "bold") 또는 커스텀 숫자(600) 허용 */
  weight?: FontWeight;
  /** 테마 컬러("primary", "danger") 또는 커스텀 Hex("#FF0000") 허용 */
  color?: ColorVariant | "currentColor";
}

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
    // Label의 기본 primary 색상은 text.primary를 따르게 처리
    if ($color === "primary") return theme.colors.text.primary;
    if ($color === "secondary") return theme.colors.text.secondary;

    // 그 외 상태 컬러(danger 등)나 Hex 값은 믹스인에 위임
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
