import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Loader2 } from "lucide-react";
import { spin } from "../../styles/animation";
import { applyAnimation, squareIconSize } from "../../styles/mixins";
import { type IconSize, type ColorVariant } from "../../styles/types";
import { useUiConfig } from "../../ConfigProvider";

export interface SpinnerProps extends Omit<
  React.SVGAttributes<SVGSVGElement>,
  "color"
> {
  /** 테마 아이콘 사이즈 토큰("md", "lg"), 커스텀 픽셀 문자열("24px"), 또는 숫자(24) 지원 */
  size?: IconSize | (number & {});
  /** 테마 컬러 토큰("brand", "success" 등), 커스텀 Hex, 또는 "currentColor" */
  color?: ColorVariant | "currentColor";
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", color = "brand", className, ...props }, ref) => {
    const { t } = useUiConfig();

    return (
      <StyledSpinner
        ref={ref}
        $size={size}
        $color={color}
        className={className}
        role="status"
        aria-label={props["aria-label"] || t("common.loading")}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) => !["$color", "$size"].includes(prop),
};

const StyledSpinner = styled(Loader2, filterProps)<{
  $color: string;
  $size: SpinnerProps["size"];
}>`
  ${({ theme, $size }) => {
    const finalSize = typeof $size === "number" ? `${$size}px` : $size || "md";
    return squareIconSize(theme, finalSize as IconSize);
  }}

  color: ${({ theme, $color }) => {
    if ($color === "currentColor" || $color === "inherit") return $color;

    // 브랜드 컬러 폴백 (그라데이션은 텍스트 컬러 속성으로 먹지 않으므로 대표 단색인 cyan 사용)
    if ($color === "brand")
      return theme.colors.brand.cyan || theme.colors.brand.primary;

    if (["success", "danger", "warning", "info"].includes($color)) {
      return theme.colors.status[
        $color as "success" | "danger" | "warning" | "info"
      ];
    }

    return $color;
  }};

  ${({ theme }) => applyAnimation(theme, spin, "1s", "linear")}
  animation-iteration-count: infinite;
`;
