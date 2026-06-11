import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import {
  type AppearanceVariant,
  type ColorVariant,
  type ControlSize,
} from "../../styles/types";
import {
  inlineComponentBase,
  compactSizeBase,
  componentColorStyle,
  transitionBase,
} from "../../styles/mixins";

/**
 * Badge의 형태, 색상, 크기 토큰을 정의합니다.
 *
 * 모든 시각 스타일은 theme token과 mixin을 통해 계산되며, 외부 간격은 부모
 * Layout의 gap/padding으로 제어합니다.
 */
export interface BadgeProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** Badge의 외형 variant입니다. */
  variant?: AppearanceVariant;
  /** theme color intent 또는 디자인 시스템에서 허용한 컬러 토큰입니다. */
  color?: ColorVariant;
  /** theme control size 기반의 밀도 토큰입니다. */
  size?: ControlSize;
}

/**
 * 짧은 상태, 카운트, 분류 정보를 표시하는 inline status 컴포넌트입니다.
 *
 * span 표준 속성과 ref를 지원하며, `componentColorStyle`과 `compactSizeBase`로
 * 색상/밀도를 일관되게 계산합니다.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { children, variant = "subtle", color = "default", size = "sm", ...props },
    ref,
  ) => {
    return (
      <StyledBadge
        ref={ref}
        $variant={variant}
        $color={color}
        $size={size}
        {...props}
      >
        {children}
      </StyledBadge>
    );
  },
);

Badge.displayName = "Badge";

// ==========================================
// Styled Components
// ==========================================

const StyledBadge = styled.span<{
  $variant: AppearanceVariant;
  $color: ColorVariant;
  $size: ControlSize;
}>`
  ${({ theme }) => inlineComponentBase(theme)};
  ${({ theme, $size }) => compactSizeBase(theme, $size)};

  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-weight: ${({ theme }) => theme.fontWeights.bold};

  ${({ theme, $variant, $color }) =>
    componentColorStyle(theme, $variant, $color)};

  ${({ theme }) => transitionBase(theme)};
`;
