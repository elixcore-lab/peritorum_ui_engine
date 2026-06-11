import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { applyAnimation, fixedCover, overlayShow } from "../../styles";

/**
 * Overlay primitive에 전달할 레이어 순서와 표준 div 속성을 정의합니다.
 *
 * 스타일은 theme/mixin으로만 관리하기 위해 React의 `style` prop은 제외합니다.
 */
export interface OverlayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  zIndex?: number;
}

/**
 * 모달, 알럿, 드로어 뒤에 표시되는 전역 dim overlay입니다.
 *
 * fixed cover mixin과 overlay animation을 적용하며, ref와 접근성 속성을 그대로
 * 전달할 수 있습니다.
 */
export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  ({ zIndex, ...props }, ref) => {
    return <StyledOverlay ref={ref} $zIndex={zIndex} {...props} />;
  },
);

Overlay.displayName = "Overlay";

const StyledOverlay = styled.div<{ $zIndex?: number }>`
  background-color: ${({ theme }) => theme.colors.background.overlay};
  ${fixedCover}

  z-index: ${({ $zIndex, theme }) => $zIndex ?? theme.zIndices.modal - 1};

  ${({ theme }) =>
    applyAnimation(
      theme,
      overlayShow,
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}

  backdrop-filter: blur(${({ theme }) => theme.sizes.component.overlayBlur});
`;
