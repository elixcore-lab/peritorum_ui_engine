import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { type ColorVariant, type ControlSize } from "../../styles/types";
import {
  inlineComponentBase,
  compactSizeBase,
  subtleVariantStyle,
  transitionBase,
} from "../../styles/mixins";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ColorVariant;
  size?: ControlSize;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "default", size = "sm", ...props }, ref) => {
    return (
      <StyledBadge ref={ref} $variant={variant} $size={size} {...props}>
        {children}
      </StyledBadge>
    );
  },
);

Badge.displayName = "Badge";

const StyledBadge = styled.span<{ $variant: ColorVariant; $size: ControlSize }>`
  ${({ theme }) => inlineComponentBase(theme)};
  ${({ theme, $size }) => compactSizeBase(theme, $size)};

  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-weight: ${({ theme }) => theme.fontWeights.extraBold};
  ${({ theme, $variant }) => subtleVariantStyle(theme, $variant)};
  ${({ theme }) => transitionBase(theme)};
`;
