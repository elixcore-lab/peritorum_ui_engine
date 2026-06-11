import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import {
  type AppearanceVariant,
  type ColorVariant,
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

/**
 * Tag의 형태, 색상, 크기, 닫기 액션을 정의합니다.
 *
 * 모든 시각 스타일은 theme token과 mixin으로 계산되며, 외부 간격은 부모 Layout의
 * gap/padding으로 제어합니다.
 */
export interface TagProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** Tag의 외형 variant입니다. */
  variant?: AppearanceVariant;
  /** theme color intent 또는 디자인 시스템에서 허용한 컬러 토큰입니다. */
  color?: ColorVariant;
  /** theme control size 기반의 밀도 토큰입니다. */
  size?: ControlSize;
  /** 닫기 버튼 클릭 이벤트입니다. 제공 시 우측에 제거 액션이 렌더링됩니다. */
  onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * 선택된 필터, 상태 라벨, 분류 값을 표시하는 compact inline 컴포넌트입니다.
 *
 * `onClose`가 제공되면 접근성 라벨이 있는 icon-only 제거 버튼을 함께 렌더링합니다.
 */
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
            <TagCloseButton
              variant="ghost"
              color="default"
              size={closeBtnSize}
              shape="circle"
              icon={<X />}
              onClick={handleClose}
              aria-label={t("common.remove")}
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
  $color: ColorVariant;
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
`;

const TagCloseButton = styled(IconButton)`
  color: inherit;
`;
