import React, { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import styled from "@emotion/styled";
import { css, useTheme, type Theme } from "@emotion/react";
import { ChevronDown, Check } from "lucide-react";
import {
  applyAnimation,
  applyTransition,
  controlBorder,
  controlDisabledStyle,
  customScrollbar,
  focusRing,
  slideDownAndFade,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";

// --- Types ---
export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  isDisabled?: boolean;
  width?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  isError?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
}

// --- Style Lookups ---
const getSizeStyle = (theme: Theme, size: Required<SelectProps>["size"]) => {
  const sizeConfig = {
    sm: {
      height: theme.sizes.control.sm,
      fontSize: theme.fontSizes.xs,
      padding: `0 ${theme.spacing.base}`,
    },
    md: {
      height: theme.sizes.control.md,
      fontSize: theme.fontSizes.sm,
      padding: `0 ${theme.spacing.md}`,
    },
    lg: {
      height: theme.sizes.control.lg,
      fontSize: theme.fontSizes.base,
      padding: `0 ${theme.spacing.md}`,
    },
  };
  const { height, fontSize, padding } = sizeConfig[size];

  return css`
    height: ${height};
    font-size: ${fontSize};
    padding: ${padding};
  `;
};

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$inputSize", "$isError", "$fullWidth"].includes(prop),
};

// --- Styled Components ---

const Trigger = styled(SelectPrimitive.Trigger, filterProps)<{
  $inputSize: "sm" | "md" | "lg";
  $isError?: boolean;
  $fullWidth?: string;
}>`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  gap: ${({ theme }) => theme.spacing.sm};
  width: ${({ $fullWidth }) => $fullWidth || "100%"};

  background-color: ${({ theme }) => theme.colors.background.input};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  ${({ theme, $isError }) => controlBorder(theme, $isError)}

  ${({ theme }) =>
    applyTransition(
      theme,
      "border-color, box-shadow, background-color",
      theme.transitions.duration.normal,
      theme.transitions.function.easeInOut,
    )}

  ${({ theme, $inputSize }) => getSizeStyle(theme, $inputSize)}

  &:hover:not(:disabled) {
    border-color: ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.brand.cyan};
  }

  &:focus {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &[data-disabled] {
    ${({ theme }) => controlDisabledStyle(theme)}
  }

  /* Placeholder 텍스트 색상 처리 */
  &[data-placeholder] {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const Content = styled(SelectPrimitive.Content)`
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.surface};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};
  z-index: ${({ theme }) => theme.zIndices.popover};

  ${({ theme }) =>
    applyAnimation(
      theme,
      slideDownAndFade,
      theme.transitions.duration.fast,
      theme.transitions.function.spring,
    )}
`;

const Viewport = styled(SelectPrimitive.Viewport)`
  padding: ${({ theme }) => theme.spacing.xs};
  max-height: ${({ theme }) => theme.sizes.component.selectViewportMaxHeight};
  ${({ theme }) => customScrollbar(theme)}
`;

const Item = styled(SelectPrimitive.Item)`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  user-select: none;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color, color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  /* 키보드 방향키 이동 및 Hover 시 하이라이트 */
  &[data-highlighted] {
    background-color: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.text.primary};
    outline: none;
  }

  /* 선택된 아이템은 브랜드 컬러 적용 */
  &[data-state="checked"] {
    color: ${({ theme }) => theme.colors.brand.cyan};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }
`;

const ItemTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ValueContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
`;

const IconSlot = styled.span`
  display: flex;
`;

const SelectIcon = styled.svg`
  width: ${({ theme }) => theme.sizes.icon.sm};
  height: ${({ theme }) => theme.sizes.icon.sm};
  flex-shrink: 0;
`;

// --- Component ---

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      options,
      placeholder,
      isDisabled,
      width,
      icon,
      size = "md",
      isError = false,
      onChange,
      onOpenChange,
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const theme = useTheme();
    const resolvedPlaceholder =
      placeholder ?? t("ui.component.select.placeholder");
    const resolvedDisabled = resolveDisabled({ isDisabled });

    return (
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        onOpenChange={onOpenChange}
        disabled={resolvedDisabled}
      >
        <Trigger
          ref={ref}
          $inputSize={size}
          $isError={isError}
          $fullWidth={width}
        >
          <ValueContent>
            {icon && <IconSlot>{icon}</IconSlot>}
            <SelectPrimitive.Value placeholder={resolvedPlaceholder} />
          </ValueContent>
          <SelectPrimitive.Icon asChild>
            <SelectIcon as={ChevronDown} />
          </SelectPrimitive.Icon>
        </Trigger>

        <SelectPrimitive.Portal>
          <Content position="popper" sideOffset={theme.sizes.offset.popover}>
            <Viewport>
              {options.map((opt) => (
                <Item key={opt.value} value={opt.value}>
                  <ItemTextWrapper>
                    {opt.icon && opt.icon}
                    <SelectPrimitive.ItemText>
                      {opt.label}
                    </SelectPrimitive.ItemText>
                  </ItemTextWrapper>
                  <SelectPrimitive.ItemIndicator>
                    <SelectIcon as={Check} />
                  </SelectPrimitive.ItemIndicator>
                </Item>
              ))}
            </Viewport>
          </Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    );
  },
);

Select.displayName = "Select";
