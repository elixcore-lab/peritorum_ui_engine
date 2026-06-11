import { forwardRef, useState, useMemo } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { Search, ChevronDown, Check } from "lucide-react";
import {
  formControlBase,
  flexCenter,
  controlSizeBase,
  squareIconSize,
  popoverContentBase,
  popoverItemBase,
  type ControlSize,
  type FontSize,
} from "../../styles";
import { resolveDisabled } from "../../utils";
import { Spinner } from "../feedback/Spinner";
import { useUiConfig } from "../../ConfigProvider";

export interface ComboBoxOption {
  value: string;
  label: string;
}

export interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  size?: ControlSize;
  fontSize?: FontSize;
  width?: string;
}

export const ComboBox = forwardRef<HTMLInputElement, ComboBoxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder,
      disabled,
      isError,
      isLoading,
      size = "md",
      fontSize,
      width,
    },
    ref,
  ) => {
    const theme = useTheme();
    const { t } = useUiConfig();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    const filteredOptions = useMemo(() => {
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [options, searchTerm]);

    const selectedLabel =
      options.find((opt) => opt.value === value)?.label || "";

    const handleSelect = (val: string) => {
      onChange(val);
      setSearchTerm("");
      setOpen(false);
    };

    return (
      <ComboBoxWrapper $width={width}>
        <PopoverPrimitive.Root
          open={open && !trulyDisabled}
          onOpenChange={setOpen}
        >
          <PopoverPrimitive.Anchor asChild>
            <InputContainer>
              <InputIconWrapper $position="left" $size={size}>
                <Search />
              </InputIconWrapper>

              <StyledComboBoxInput
                ref={ref}
                $size={size}
                $fontSize={fontSize}
                $isError={isError}
                placeholder={selectedLabel || placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setOpen(true)}
                disabled={trulyDisabled}
                data-disabled={trulyDisabled ? "" : undefined}
                role="combobox"
                aria-expanded={open}
                aria-controls="combobox-listbox"
              />

              <InputIconWrapper $position="right" $size={size}>
                {isLoading ? (
                  <Spinner
                    size={size === "xs" || size === "sm" ? "xs" : "sm"}
                  />
                ) : (
                  <ChevronDown />
                )}
              </InputIconWrapper>
            </InputContainer>
          </PopoverPrimitive.Anchor>

          <PopoverPrimitive.Portal>
            <ComboBoxContent
              id="combobox-listbox"
              role="listbox"
              sideOffset={theme.sizes.offset.popover}
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <ComboBoxItem
                    key={opt.value}
                    role="option"
                    aria-selected={value === opt.value}
                    onClick={() => handleSelect(opt.value)}
                  >
                    {opt.label}
                    {value === opt.value && (
                      <CheckIconWrapper>
                        <Check />
                      </CheckIconWrapper>
                    )}
                  </ComboBoxItem>
                ))
              ) : (
                <NoResult role="status">
                  {t("ui.component.combobox.noResults")}
                </NoResult>
              )}
            </ComboBoxContent>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </ComboBoxWrapper>
    );
  },
);

ComboBox.displayName = "ComboBox";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$width", "$size", "$fontSize", "$isError", "$position"].includes(prop),
};

const ComboBoxWrapper = styled("div", filterProps)<{ $width?: string }>`
  position: relative;
  display: inline-flex;
  width: ${({ $width }) => $width || "100%"};
`;

const InputContainer = styled.div`
  width: 100%;
  position: relative;
`;

const StyledComboBoxInput = styled("input", filterProps)<{
  $isError?: boolean;
  $size: ControlSize | (string & {});
  $fontSize?: FontSize | (string & {});
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}

  ${({ theme, $size, $fontSize }) =>
    controlSizeBase(theme, $size as ControlSize, $fontSize)}
  
  padding-left: ${({ theme, $size }) =>
    theme.sizes.control[$size as keyof typeof theme.sizes.control] || $size};
  padding-right: ${({ theme, $size }) =>
    theme.sizes.control[$size as keyof typeof theme.sizes.control] || $size};

  cursor: text;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const InputIconWrapper = styled("div", filterProps)<{
  $position: "left" | "right";
  $size: ControlSize | (string & {});
}>`
  position: absolute;
  top: 0;
  width: ${({ theme, $size }) =>
    theme.sizes.control[$size as keyof typeof theme.sizes.control] || $size};
  height: 100%;
  ${flexCenter}

  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")}
  
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  z-index: 1;

  & > svg {
    ${({ theme, $size }) =>
      squareIconSize(theme, $size === "xs" || $size === "sm" ? "xs" : "sm")}
  }
`;

const CheckIconWrapper = styled.span`
  ${flexCenter}
  color: ${({ theme }) =>
    theme.colors.brand.cyan || theme.colors.brand.primary};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
  }
`;

const ComboBoxContent = styled(PopoverPrimitive.Content)`
  ${({ theme }) => popoverContentBase(theme)}
  width: var(--radix-popover-trigger-width);
  max-height: ${({ theme }) => theme.sizes.component.selectViewportMaxHeight};
`;

const ComboBoxItem = styled.div`
  ${({ theme }) => popoverItemBase(theme)}
`;

const NoResult = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
