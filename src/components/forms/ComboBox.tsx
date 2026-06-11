import { forwardRef, useState, useMemo } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { Search, ChevronDown, Check } from "lucide-react";
import {
  formControlBase,
  disabledState,
  flexCenter,
  controlSizeBase,
  squareIconSize,
  ControlSize,
  popoverContentBase,
  popoverItemBase,
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

    const handleSelect = (val: string, label: string) => {
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
            <div style={{ width: "100%", position: "relative" }}>
              <InputIconWrapper $position="left">
                <Search />
              </InputIconWrapper>

              <StyledComboBoxInput
                ref={ref}
                $size={size}
                $isError={isError}
                placeholder={selectedLabel || placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setOpen(true)}
                disabled={trulyDisabled}
                role="combobox"
                aria-expanded={open}
                aria-controls="combobox-listbox"
              />

              <InputIconWrapper $position="right">
                {isLoading ? (
                  <Spinner size="sm" color="currentColor" />
                ) : (
                  <ChevronDown />
                )}
              </InputIconWrapper>
            </div>
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
                    onClick={() => handleSelect(opt.value, opt.label)}
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

// --- Styled Components ---

const ComboBoxWrapper = styled.div<{ $width?: string }>`
  position: relative;
  display: inline-flex;
  width: ${({ $width }) => $width || "100%"};
`;

const StyledComboBoxInput = styled.input<{
  $isError?: boolean;
  $size: ControlSize;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}
  ${({ theme, $size }) => controlSizeBase(theme, $size)}
  
  padding-left: ${({ theme }) => theme.spacing.xl};
  padding-right: ${({ theme }) => theme.spacing.xl};
  cursor: text;

  ${({ theme }) => disabledState(theme)}
`;

const InputIconWrapper = styled.div<{ $position: "left" | "right" }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${flexCenter}
  color: ${({ theme }) => theme.colors.text.disabled};

  ${({ $position, theme }) =>
    $position === "left"
      ? css`
          left: ${theme.spacing.base};
        `
      : css`
          right: ${theme.spacing.base};
        `}

  pointer-events: none;

  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
  }
`;

const CheckIconWrapper = styled.span`
  ${flexCenter}
  color: inherit;

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
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;
