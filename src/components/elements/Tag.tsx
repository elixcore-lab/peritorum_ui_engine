import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { type ColorVariant, type ControlSize } from "../../styles/types";
import {
  compactSizeBase,
  inlineComponentBase,
  subtleVariantStyle,
  transitionBase,
} from "../../styles/mixins";
import { IconButton } from "./IconButton";
import { useUiConfig } from "../../ConfigProvider";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ColorVariant;
  size?: ControlSize;
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, variant = "default", size = "md", onClose, ...props }, ref) => {
    const { t } = useUiConfig();
    const closeBtnSize: ControlSize = size === "lg" ? "sm" : "xs";

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onClose) onClose(e);
    };

    return (
      <StyledTag ref={ref} $variant={variant} $size={size} {...props}>
        {children}
        {onClose && (
          <TagCloseWrapper $size={size}>
            <IconButton
              variant="ghost"
              size={closeBtnSize}
              shape="circle"
              icon={<X />}
              onClick={handleClose}
              aria-label={t("common.remove")}
              style={{ color: "inherit" }}
            />
          </TagCloseWrapper>
        )}
      </StyledTag>
    );
  },
);

Tag.displayName = "Tag";

const StyledTag = styled.span<{ $variant: ColorVariant; $size: ControlSize }>`
  ${({ theme }) => inlineComponentBase(theme)};
  ${({ theme, $size }) => compactSizeBase(theme, $size)};
  ${({ theme, $variant }) => subtleVariantStyle(theme, $variant)};
  ${({ theme }) => transitionBase(theme)};
`;

const TagCloseWrapper = styled.span<{ $size: ControlSize }>`
  display: inline-flex;
  margin-right: calc(${({ theme }) => theme.spacing.xs} * -1);
  margin-left: ${({ theme, $size }) =>
    $size === "lg" ? theme.spacing.xs : theme.spacing.xxs};
`;
