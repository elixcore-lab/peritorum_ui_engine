import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import {
  type AppearanceVariant,
  type ComponentColor,
  type ControlSize,
} from "../../styles/types";
import {
  compactSizeBase,
  inlineComponentBase,
  componentColorStyle,
  transitionBase,
} from "../../styles/mixins";
import { IconButton } from "./IconButton";
import { useUiConfig } from "../../ConfigProvider";

export interface TagProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** * 태그의 형태 (기본값: "subtle")
   * - solid, subtle, outline, ghost
   */
  variant?: AppearanceVariant;
  /** * 태그의 색상 (기본값: "default")
   * - 테마 토큰 (primary, warning 등) 또는 Hex Color 지원
   */
  color?: ComponentColor;
  /** 태그의 크기 (기본값: "md") */
  size?: ControlSize;
  /** 닫기 버튼 클릭 이벤트 (함수 주입 시 우측에 'X' 버튼이 자동 렌더링됩니다) */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = "subtle",
      color = "default",
      size = "md",
      onClose,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();

    // 태그 크기에 비례하여 닫기 버튼 크기를 자동으로 조정합니다.
    const closeBtnSize: ControlSize = size === "lg" ? "sm" : "xs";

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation(); // 부모 요소로의 클릭 이벤트 전파 차단
      if (onClose) onClose(e);
    };

    return (
      <StyledTag
        ref={ref}
        $variant={variant}
        $color={color}
        $size={size}
        {...props}
      >
        {children}

        {/* onClose 이벤트가 있을 때만 닫기 버튼을 렌더링합니다 */}
        {onClose && (
          <TagCloseWrapper $size={size}>
            <IconButton
              variant="ghost" // 투명한 배경
              color="default"
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

// ==========================================
// Styled Components
// ==========================================

const StyledTag = styled.span<{
  $variant: AppearanceVariant;
  $color: ComponentColor;
  $size: ControlSize;
}>`
  ${({ theme }) => inlineComponentBase(theme)};
  ${({ theme, $size }) => compactSizeBase(theme, $size)};

  border-radius: ${({ theme }) => theme.borderRadius.md};

  ${({ theme, $variant, $color }) =>
    componentColorStyle(theme, $variant, $color)};

  ${({ theme }) => transitionBase(theme)};
`;

const TagCloseWrapper = styled.span<{ $size: ControlSize }>`
  display: inline-flex;
  align-items: center;

  /* 태그 우측 패딩을 상쇄하여 닫기 버튼이 예쁘게 끝에 붙도록 마진 조정 */
  margin-right: calc(${({ theme }) => theme.spacing.xs} * -1);
  margin-left: ${({ theme, $size }) =>
    $size === "lg" ? theme.spacing.xs : theme.spacing["2xs"]};
`;
