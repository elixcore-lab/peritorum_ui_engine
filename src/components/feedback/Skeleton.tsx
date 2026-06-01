import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { applyAnimation, skeletonPulse } from "../../styles";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  shape?: "rect" | "circle";
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, shape = "rect", ...props }, ref) => {
    return (
      <StyledSkeleton
        ref={ref}
        $width={width}
        $height={height}
        $shape={shape}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

const StyledSkeleton = styled.div<{
  $width?: string | number;
  $height?: string | number;
  $shape: "rect" | "circle";
}>`
  width: ${({ $width }) =>
    typeof $width === "number" ? `${$width}px` : $width || "100%"};

  height: ${({ $height }) =>
    typeof $height === "number" ? `${$height}px` : $height || "100%"};

  border-radius: ${({ $shape, theme }) =>
    $shape === "circle" ? theme.borderRadius.round : theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface.sunken};

  ${({ theme }) =>
    applyAnimation(
      theme,
      skeletonPulse,
      theme.transitions.duration.slow || "1.5s",
      theme.transitions.function.easeInOut,
    )}
  animation-iteration-count: infinite;
`;
