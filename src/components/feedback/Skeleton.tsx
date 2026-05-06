import React from "react";
import styled from "@emotion/styled";
import { applyAnimation, skeletonPulse } from "../../styles";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  shape?: "rect" | "circle";
}

const StyledSkeleton = styled.div<SkeletonProps>`
  width: ${({ width }) =>
    typeof width === "number" ? `${width}px` : width || "100%"};
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height || "auto"};
  border-radius: ${({ shape, theme }) =>
    shape === "circle" ? theme.borderRadius.round : theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  ${({ theme }) =>
    applyAnimation(
      theme,
      skeletonPulse,
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
  animation-iteration-count: infinite;
`;

export const Skeleton = (props: SkeletonProps) => {
  return <StyledSkeleton {...props} />;
};

Skeleton.displayName = "Skeleton";
