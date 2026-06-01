import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Loader2 } from "lucide-react";
import { css } from "@emotion/react";
import { spin } from "../../styles/animation";
import { applyAnimation, IconSize, squareIconSize } from "../../styles";
import { useUiConfig } from "../../ConfigProvider";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: IconSize | number | string;
  color?: string;
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", color, className, ...props }, ref) => {
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

const StyledSpinner = styled(Loader2)<{
  $color?: string;
  $size?: SpinnerProps["size"];
}>`
  ${({ theme, $size }) => {
    if (typeof $size === "string" && $size in theme.sizes.icon) {
      return squareIconSize(theme, $size as IconSize);
    }

    const customSize = typeof $size === "number" ? `${$size}px` : $size;
    return css`
      width: ${customSize || theme.sizes.icon.md};
      height: ${customSize || theme.sizes.icon.md};
    `;
  }}

  color: ${({ theme, $color }) => $color || theme.colors.brand.cyan};

  ${({ theme }) => applyAnimation(theme, spin, "1s", "linear")}

  animation-iteration-count: infinite;
`;
