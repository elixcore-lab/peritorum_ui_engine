import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { applyAnimation, fixedCover, overlayShow } from "../../styles";

export interface OverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  zIndex?: number;
}
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
