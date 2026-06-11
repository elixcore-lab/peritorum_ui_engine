import React, { forwardRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import styled from "@emotion/styled";
import { type ColorVariant, type ControlSize } from "../../styles/types";
import {
  disabledState,
  focusRing,
  applyTransition,
  resolveThemeColor,
  progressBarHeight,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";

/**
 * Slider의 값, 색상, 크기, thumb 접근성 라벨을 정의합니다.
 *
 * Radix Slider Root 속성을 상속하며, color prop은 디자인 시스템 색상 intent로
 * 재정의합니다.
 */
export interface SliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  "color" | "style"
> {
  value?: number[];
  defaultValue?: number[];
  color?: ColorVariant;
  size?: ControlSize;
  thumbAriaLabels?: string[];
}

/**
 * 단일 값 또는 범위 값을 조정하는 Radix 기반 slider 컴포넌트입니다.
 *
 * thumb 개수는 value/defaultValue 길이에서 계산되며, 접근성 라벨은 i18n 기본값을
 * 사용하거나 thumbAriaLabels로 개별 지정할 수 있습니다.
 */
export const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      value,
      defaultValue,
      color = "brand",
      size = "md",
      disabled,
      thumbAriaLabels,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const values = value || defaultValue || [0];
    const defaultThumbLabel = t("ui.component.slider.thumb");

    return (
      <StyledSliderRoot
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        $size={size}
        {...props}
      >
        <StyledTrack $size={size}>
          <StyledRange $color={color} />
        </StyledTrack>

        {values.map((_, index) => (
          <StyledThumb
            key={index}
            aria-label={thumbAriaLabels?.[index] || defaultThumbLabel}
          />
        ))}
      </StyledSliderRoot>
    );
  },
);

Slider.displayName = "Slider";

// ==========================================
// Styled Components
// ==========================================

// 💡 DOM 에러(프롭 누수) 완벽 차단
const rootFilter = {
  shouldForwardProp: (prop: string) => !["$size"].includes(prop),
};
const rangeFilter = {
  shouldForwardProp: (prop: string) => !["$color"].includes(prop),
};
const trackFilter = {
  shouldForwardProp: (prop: string) => !["$size"].includes(prop),
};

const StyledSliderRoot = styled(SliderPrimitive.Root, rootFilter)<{
  $size: ControlSize | (string & {});
}>`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;

  &[data-orientation="horizontal"] {
    width: 100%;
    height: ${({ theme }) => theme.sizes.component.radio};
  }

  &[data-orientation="vertical"] {
    flex-direction: column;
    width: ${({ theme }) => theme.sizes.component.radio};
    height: 100%;
    /* min-height: ${({ theme }) => theme.sizes.component.emptyStateHeight}; */
  }

  ${({ theme }) => disabledState(theme)}
`;

const StyledTrack = styled(SliderPrimitive.Track, trackFilter)<{
  $size: ControlSize;
}>`
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  position: relative;
  flex-grow: 1;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  box-shadow: inset ${({ theme }) => theme.spacing.none}
    ${({ theme }) => theme.sizes.component.dividerThin}
    ${({ theme }) => theme.spacing["2xs"]}
    ${({ theme }) => theme.colors.utility.shadowColor};

  &[data-orientation="horizontal"] {
    height: ${({ theme, $size }) => progressBarHeight(theme, $size as string)};
  }

  &[data-orientation="vertical"] {
    width: ${({ theme, $size }) => progressBarHeight(theme, $size as string)};
  }
`;

const StyledRange = styled(SliderPrimitive.Range, rangeFilter)<{
  $color: string;
}>`
  position: absolute;
  border-radius: inherit;
  background: ${({ theme, $color }) => resolveThemeColor(theme, $color)};

  &[data-orientation="horizontal"] {
    height: 100%;
  }

  &[data-orientation="vertical"] {
    width: 100%;
  }
`;

const StyledThumb = styled(SliderPrimitive.Thumb)`
  display: block;
  width: ${({ theme }) => theme.sizes.component.radio};
  height: ${({ theme }) => theme.sizes.component.radio};
  background-color: ${({ theme }) => theme.colors.brand.ink};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.md};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  cursor: grab;

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform, box-shadow",
      theme.transitions.duration.fast,
      theme.transitions.function.bounce,
    )}

  &:hover {
    transform: scale(1.15);
  }

  &:active {
    cursor: grabbing;
    transform: scale(1.05);
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
  }
`;
