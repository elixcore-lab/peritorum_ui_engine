import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { applyAnimation, skeletonPulse } from "../../styles"; // 경로 확인

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 스켈레톤의 너비 (예: "100%", "300px", 40) */
  width?: string | number;
  /** 스켈레톤의 높이 (예: "1.5rem", "50px", 40) */
  height?: string | number;
  /** 스켈레톤의 형태 (사각형 또는 원형) */
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
        aria-hidden="true" // 💡 스크린 리더가 이 뼈대 UI를 읽지 않도록 숨김 처리 (웹 접근성)
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$width", "$height", "$shape"].includes(prop),
};

const StyledSkeleton = styled("div", filterProps)<{
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
      skeletonPulse, // opacity가 깜빡이는 애니메이션
      theme.transitions.duration.slow || "1.5s",
      theme.transitions.function.easeInOut,
    )}

  animation-iteration-count: infinite;
`;
