import React, { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import styled from "@emotion/styled";
import { type ControlSize } from "../../styles/types";
import { flexCenter, squareComponentSize } from "../../styles/mixins";

/**
 * Avatar가 표시할 이미지, 대체 텍스트, fallback, 크기 토큰을 정의합니다.
 *
 * Radix Avatar Root 속성을 상속하며, 크기는 theme control size token을 사용합니다.
 */
export interface AvatarProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    "style"
  > {
  src?: string;
  alt?: string;
  fallback: string;
  size?: ControlSize;
}

/**
 * 사용자 또는 엔티티의 시각적 식별자를 표시하는 Radix 기반 Avatar 컴포넌트입니다.
 *
 * 이미지 로드 실패 시 fallback 텍스트를 표시하며, 모든 크기/색상은 theme token과
 * 공통 mixin으로 계산됩니다.
 */
export const Avatar = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ src, alt, fallback, size = "md", ...props }, ref) => {
  return (
    <AvatarRoot ref={ref} $size={size} {...props}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </AvatarRoot>
  );
});
Avatar.displayName = "Avatar";

const filterProps = {
  shouldForwardProp: (prop: string) => prop !== "$size",
};
const AvatarRoot = styled(AvatarPrimitive.Root, filterProps)<{
  $size: ControlSize;
}>`
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

  ${({ theme, $size }) => squareComponentSize(theme, $size)}
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
  color: ${({ theme }) => theme.colors.brand.cyan};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
