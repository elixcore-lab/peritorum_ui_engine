import React, { forwardRef } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import styled from "@emotion/styled";
import { disabledState, focusRing, applyTransition } from "../../styles/mixins";

export interface SliderProps extends React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> {
  value?: number[];
  defaultValue?: number[];
  color?: string;
}

export const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ value, defaultValue, color, disabled, ...props }, ref) => {
  const values = value || defaultValue || [0];

  return (
    <StyledSliderRoot
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      {...props}
    >
      <StyledTrack>
        <StyledRange $color={color} />
      </StyledTrack>

      {values.map((_, index) => (
        <StyledThumb key={index} aria-label="Volume" />
      ))}
    </StyledSliderRoot>
  );
});

Slider.displayName = "Slider";

// --- Styled Components ---

const StyledSliderRoot = styled(SliderPrimitive.Root)`
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
    min-height: 120px; /* 세로 모드의 최소 높이 보장 */
  }

  &[data-disabled] {
    ${({ theme }) => disabledState(theme)}
  }
`;

const StyledTrack = styled(SliderPrimitive.Track)`
  background-color: ${({ theme }) => theme.colors.surface.sunken};
  position: relative;
  flex-grow: 1;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  box-shadow: inset 0 1px 2px ${({ theme }) => theme.colors.utility.shadowColor};

  &[data-orientation="horizontal"] {
    height: ${({ theme }) => theme.spacing.xs}; /* 4px 두께 */
  }

  &[data-orientation="vertical"] {
    width: ${({ theme }) => theme.spacing.xs};
  }
`;

const StyledRange = styled(SliderPrimitive.Range)<{ $color?: string }>`
  position: absolute;
  background-color: ${({ theme, $color }) => $color || theme.colors.brand.cyan};
  border-radius: inherit;

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
