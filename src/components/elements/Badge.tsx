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

export interface BadgeProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** * 뱃지의 형태 (기본값: "subtle")
   * - solid: 꽉 찬 배경
   * - subtle: 연한 배경
   * - outline: 테두리만
   * - ghost: 투명
   */
  variant?: AppearanceVariant;
  /** * 뱃지의 색상 (기본값: "default")
   * - 테마 토큰 (primary, danger, offline 등) 또는 Hex Color (#RRGGBB) 지원
   */
  color?: ColorVariant;
  /** 뱃지의 크기 (기본값: "sm") */
  size?: ControlSize;
}

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
