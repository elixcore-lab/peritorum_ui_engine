import React, { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import styled from "@emotion/styled";
import { css, type Theme } from "@emotion/react";
import { type ControlSize, type ColorVariant } from "../../styles/types";
import {
  applyTransition,
  focusRing,
  transitionBase,
  disabledState,
  flexCenter,
  squareIconSize,
  resolveThemeColor,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";
import { Label } from "./Label";
import { Spinner } from "../feedback/Spinner";

/**
 * Switch의 크기, 색상, 라벨, 설명, 로딩 및 아이콘 슬롯을 정의합니다.
 *
 * Radix Switch Root 속성을 상속하며 disabled/loading 상태는 `resolveDisabled`로
 * 통합 처리합니다.
 */
export interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    "style"
  > {
  size?: ControlSize;
  color?: ColorVariant;
  label?: React.ReactNode;
  description?: React.ReactNode;
  labelPosition?: "left" | "right";
  isError?: boolean;
  isLoading?: boolean;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
}

/**
 * 켜짐/꺼짐 상태를 전환하는 Radix 기반 switch 컴포넌트입니다.
 *
 * 라벨 위치, 설명, 로딩 spinner, checked 상태별 아이콘 슬롯을 지원합니다.
 */
export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(
  (
    {
      size = "md",
      color = "brand",
      label,
      description,
      labelPosition = "right",
      isError,
      isLoading,
      disabled,
      iconOn,
      iconOff,
      id,
      className,
      checked,
      ...props
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    return (
      <SwitchWrapper className={className} $labelPosition={labelPosition}>
        {(label || description) && (
          <SwitchLabelGroup $labelPosition={labelPosition}>
            {label && (
              <Label htmlFor={id} disabled={trulyDisabled}>
                {label}
              </Label>
            )}
            {description && (
              <SwitchDescription $disabled={trulyDisabled}>
                {description}
              </SwitchDescription>
            )}
          </SwitchLabelGroup>
        )}

        <StyledSwitch
          ref={ref}
          id={id}
          $size={size}
          $color={color}
          $isError={isError}
          disabled={trulyDisabled}
          aria-invalid={isError}
          checked={checked}
          {...props}
        >
          <SwitchThumb $size={size}>
            {isLoading ? (
              <Spinner
                size={size === "xs" || size === "sm" ? "xs" : "sm"}
                color="currentColor"
              />
            ) : (
              <ThumbIconWrapper>{checked ? iconOn : iconOff}</ThumbIconWrapper>
            )}
          </SwitchThumb>
        </StyledSwitch>
      </SwitchWrapper>
    );
  },
);

Switch.displayName = "Switch";

// ==========================================
// Styled Components
// ==========================================

// 💡 DOM 속성 누수(Prop Leakage) 완벽 차단
const wrapperFilter = {
  shouldForwardProp: (prop: string) => !["$labelPosition"].includes(prop),
};
const switchFilter = {
  shouldForwardProp: (prop: string) =>
    !["$size", "$isError", "$color"].includes(prop),
};
const thumbFilter = {
  shouldForwardProp: (prop: string) => !["$size"].includes(prop),
};

const SwitchWrapper = styled("div", wrapperFilter)<{
  $labelPosition: "left" | "right";
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.base};

  ${({ $labelPosition }) =>
    $labelPosition === "left" &&
    css`
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
    `}
`;

const SwitchLabelGroup = styled("div", wrapperFilter)<{
  $labelPosition: "left" | "right";
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["2xs"]};
  order: ${({ $labelPosition }) => ($labelPosition === "left" ? 0 : 1)};
`;

const SwitchDescription = styled.span<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.disabled : theme.colors.text.secondary};
`;

type SwitchMetricSize = keyof Theme["sizes"]["component"]["switch"];

const isSwitchMetricSize = (
  size: ControlSize,
  metrics: Theme["sizes"]["component"]["switch"],
): size is SwitchMetricSize => {
  return size in metrics;
};

const getSwitchMetrics = (theme: Theme, size: ControlSize) => {
  const metrics = theme.sizes.component.switch;

  return isSwitchMetricSize(size, metrics) ? metrics[size] : metrics.md;
};

const StyledSwitch = styled(SwitchPrimitive.Root, switchFilter)<{
  $size: ControlSize;
  $color: ColorVariant;
  $isError?: boolean;
}>`
  all: unset;
  position: relative;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  background-color: ${({ theme }) => theme.colors.surface.sunken};

  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.border.strong};

  cursor: pointer;

  width: ${({ theme, $size }) => getSwitchMetrics(theme, $size).width};
  height: ${({ theme, $size }) => getSwitchMetrics(theme, $size).height};

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled):not([data-disabled]) {
    border-color: ${({ theme, $isError, $color }) =>
      $isError ? theme.colors.status.danger : resolveThemeColor(theme, $color)};
  }

  &:focus-visible {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-state="checked"] {
    background: ${({ theme, $color }) => resolveThemeColor(theme, $color)};
    border-color: ${({ theme }) => theme.colors.utility.transparent};
  }

  ${({ theme }) => disabledState(theme)}
`;

const SwitchThumb = styled(SwitchPrimitive.Thumb, thumbFilter)<{
  $size: ControlSize;
}>`
  ${flexCenter}
  background-color: ${({ theme }) => theme.colors.brand.ink};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.sm};

  width: ${({ theme, $size }) => getSwitchMetrics(theme, $size).thumb};
  height: ${({ theme, $size }) => getSwitchMetrics(theme, $size).thumb};

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform, background-color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  transform: translateX(${({ theme }) => theme.sizes.component.dividerMedium});
  will-change: transform;

  &[data-state="checked"] {
    transform: translateX(
      ${({ theme, $size }) => getSwitchMetrics(theme, $size).offset}
    );
  }
`;

const ThumbIconWrapper = styled.div`
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.secondary};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
  }
`;
