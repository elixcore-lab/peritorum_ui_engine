import React, { forwardRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { Check, ChevronDown, X } from "lucide-react";
import {
  flexCenter,
  formControlBase,
  disabledState,
  resetButton,
  controlSizeBase,
  squareIconSize,
  popoverContentBase,
  popoverItemBase,
  type ControlSize,
  type FontSize,
} from "../../styles";
import { resolveDisabled } from "../../utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  size?: ControlSize;
  fontSize?: FontSize;
  width?: string;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      disabled,
      isError,
      size = "md",
      fontSize,
      width,
    },
    ref,
  ) => {
    const trulyDisabled = resolveDisabled({ disabled });

    const toggleOption = (val: string) => {
      const newValue = value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val];
      onChange(newValue);
    };

    const removeTag = (e: React.MouseEvent, val: string) => {
      e.stopPropagation();
      e.preventDefault();
      onChange(value.filter((v) => v !== val));
    };

    return (
      <MultiSelectWrapper $width={width}>
        <PopoverPrimitive.Root>
          <StyledMultiSelectTrigger
            ref={ref}
            $isError={isError}
            $size={size}
            $fontSize={fontSize}
            disabled={trulyDisabled}
          >
            <SelectedContainer>
              {value.length > 0 ? (
                value.map((val) => (
                  <Tag key={val}>
                    {options.find((o) => o.value === val)?.label}
                    <TagCloseButton
                      type="button"
                      onClick={(e) => removeTag(e, val)}
                    >
                      <X />
                    </TagCloseButton>
                  </Tag>
                ))
              ) : (
                <Placeholder>{placeholder}</Placeholder>
              )}
            </SelectedContainer>
            <ChevronDown />
          </StyledMultiSelectTrigger>
          <PopoverPrimitive.Portal>
            <MultiSelectContent sideOffset={4} align="start">
              {options.map((opt) => {
                const isChecked = value.includes(opt.value);
                return (
                  <MultiSelectItem
                    key={opt.value}
                    $checked={isChecked}
                    onClick={() => toggleOption(opt.value)}
                  >
                    {opt.label}
                    {isChecked && <Check />}
                  </MultiSelectItem>
                );
              })}
            </MultiSelectContent>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </MultiSelectWrapper>
    );
  },
);

MultiSelect.displayName = "MultiSelect";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$isError", "$size", "$fontSize"].includes(prop),
};

const MultiSelectWrapper = styled.div<{ $width?: string }>`
  display: inline-flex;
  width: ${({ $width }) => $width || "100%"};
`;

const StyledMultiSelectTrigger = styled(PopoverPrimitive.Trigger, filterProps)<{
  $isError?: boolean;
  $size: ControlSize | (string & {});
  $fontSize?: FontSize | (string & {});
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}

  ${({ theme, $size, $fontSize }) =>
    controlSizeBase(theme, $size as ControlSize, $fontSize)}
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  height: auto;
  min-height: ${({ theme, $size }) =>
    theme.sizes.control[$size as keyof typeof theme.sizes.control] || $size};

  padding-top: ${({ theme }) => theme.spacing["2xs"]};
  padding-bottom: ${({ theme }) => theme.spacing["2xs"]};

  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => disabledState(theme)}

  & > svg {
    ${({ theme, $size }) =>
      squareIconSize(theme, $size === "xs" || $size === "sm" ? "xs" : "sm")}
    flex-shrink: 0;
  }
`;

const SelectedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing["2xs"]};
  flex: 1;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing["2xs"]};
  background-color: ${({ theme }) => theme.colors.brand.accentSoft};
  color: ${({ theme }) => theme.colors.text.primary};
  padding: ${({ theme }) => `${theme.spacing["2xs"]} ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  font-size: ${({ theme }) => theme.fontSizes.xs};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
`;

const TagCloseButton = styled.button`
  ${resetButton}
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.status.danger};
  }

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
  }
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.text.disabled};
`;

const MultiSelectContent = styled(PopoverPrimitive.Content)`
  ${({ theme }) => popoverContentBase(theme)}
  width: var(--radix-popover-trigger-width);
  max-height: ${({ theme }) => theme.sizes.component.selectViewportMaxHeight};
`;

const MultiSelectItem = styled.div<{ $checked: boolean }>`
  ${({ theme }) => popoverItemBase(theme)}

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
  }
`;
