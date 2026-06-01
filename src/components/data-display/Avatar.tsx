import React, { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import styled from "@emotion/styled";
import { css } from "@emotion/react"; // 💡 css 임포트
import { type ControlSize } from "../../styles/types";
import { flexCenter, squareComponentSize } from "../../styles/mixins";

export interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: ControlSize | "xl";
}

export const Avatar = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ src, alt, fallback, size = "md", ...props }, ref) => {
  return (
    <AvatarRoot ref={ref} $size={size} {...props}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback delayMs={600}>{fallback}</AvatarFallback>
    </AvatarRoot>
  );
});
Avatar.displayName = "Avatar";

const AvatarRoot = styled(AvatarPrimitive.Root)<{ $size: ControlSize | "xl" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  user-select: none;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};

  ${({ theme, $size }) =>
    $size === "xl"
      ? css`
          width: calc(${theme.sizes.control.lg} + ${theme.spacing.md});
          height: calc(${theme.sizes.control.lg} + ${theme.spacing.md});
        `
      : squareComponentSize(theme, $size)}
`;

const AvatarImage = styled(AvatarPrimitive.Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

const AvatarFallback = styled(AvatarPrimitive.Fallback)`
  width: 100%;
  height: 100%;
  ${flexCenter}
  background-color: ${({ theme }) => theme.colors.brand.accentSoft};
  color: ${({ theme }) => theme.colors.brand.cyan};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
