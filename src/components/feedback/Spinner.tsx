import styled from "@emotion/styled";
import { Loader2 } from "lucide-react";
import { spin } from "../../styles/animation";
import { applyAnimation } from "../../styles";

export interface SpinnerProps {
  size?: number | string;
  color?: string;
  className?: string;
}

const formatSize = (size: SpinnerProps["size"]) =>
  typeof size === "number" ? `${size}px` : size;

const StyledSpinner = styled(Loader2)<{
  $color?: string;
  $size?: SpinnerProps["size"];
}>`
  width: ${({ theme, $size }) => formatSize($size) || theme.sizes.icon.lg};
  height: ${({ theme, $size }) => formatSize($size) || theme.sizes.icon.lg};
  color: ${({ theme, $color }) => $color || theme.colors.brand.cyan};

  ${({ theme }) =>
    applyAnimation(
      theme,
      spin,
      theme.transitions.duration.fast,
      theme.transitions.function.linear,
    )}

  animation-iteration-count: infinite;
`;

export const Spinner = ({ size, color, className }: SpinnerProps) => {
  return <StyledSpinner $size={size} $color={color} className={className} />;
};

Spinner.displayName = "Spinner";
