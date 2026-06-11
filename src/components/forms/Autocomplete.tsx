import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Search } from "lucide-react";
import {
  formControlBase,
  textEllipsis,
  popoverContentBase,
  flexCenter,
  popoverItemBase,
  controlSizeBase,
  squareIconSize,
  disabledState,
  type ControlSize,
  type FontSize,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { useDebounce } from "../../hooks/useDebounce";
import { useOnClickOutside } from "../../hooks";
import { Spinner } from "../feedback/Spinner";
import { resolveDisabled } from "../../utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface AutocompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onSelect"
> {
  options: ComboboxOption[];
  isLoading?: boolean;
  onSearch?: (keyword: string) => void;
  onSelect?: (option: ComboboxOption) => void;

  /**  디자인 시스템 공통 프롭 추가 */
  size?: ControlSize;
  fontSize?: FontSize;
  isError?: boolean;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      placeholder,
      options,
      isLoading = false,
      onSearch,
      onSelect,
      size = "md",
      fontSize,
      isError = false,
      disabled = false,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();

    const [isOpen, setIsOpen] = useState(false);
    // 외부에서 value가 주입될 경우를 대비한 안전한 상태 관리
    const [inputValue, setInputValue] = useState((value as string) || "");

    const containerRef = useRef<HTMLDivElement>(null);
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    const debouncedKeyword = useDebounce(inputValue, 300);

    // 검색어 변경 시 콜백 실행
    useEffect(() => {
      if (onSearch && debouncedKeyword !== undefined) {
        onSearch(debouncedKeyword);
      }
    }, [debouncedKeyword, onSearch]);

    // 외부 클릭 시 드롭다운 닫기
    useOnClickOutside(containerRef, () => setIsOpen(false));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      setIsOpen(true);
      if (onChange) onChange(e);
    };

    const handleSelect = useCallback(
      (option: ComboboxOption) => {
        setInputValue(option.label);
        setIsOpen(false);
        if (onSelect) onSelect(option);
      },
      [onSelect],
    );

    return (
      <Container ref={containerRef}>
        <InputWrapper>
          <SearchIconWrapper $size={size}>
            <Search />
          </SearchIconWrapper>

          <StyledInput
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder || t("ui.component.select.placeholder")}
            $inputSize={size}
            $fontSize={fontSize}
            $isError={isError}
            disabled={trulyDisabled}
            data-disabled={trulyDisabled ? "" : undefined}
            role="combobox"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            {...props}
          />

          {isLoading && (
            <SpinnerWrapper $size={size}>
              <Spinner size={size === "xs" || size === "sm" ? "xs" : "sm"} />
            </SpinnerWrapper>
          )}
        </InputWrapper>

        {isOpen && (
          <DropdownList role="listbox">
            {isLoading ? (
              <StatusMessage>
                {t("ui.component.combobox.searching")}
              </StatusMessage>
            ) : options.length > 0 ? (
              options.map((option) => (
                <OptionItem
                  key={option.value}
                  role="option"
                  onClick={() => handleSelect(option)}
                >
                  <TextTruncate>{option.label}</TextTruncate>
                </OptionItem>
              ))
            ) : (
              debouncedKeyword && (
                <StatusMessage>
                  {t("ui.component.combobox.noResults")}
                </StatusMessage>
              )
            )}
          </DropdownList>
        )}
      </Container>
    );
  },
);

Autocomplete.displayName = "Autocomplete";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$inputSize", "$fontSize", "$isError"].includes(prop),
};

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div<{ $size: ControlSize }>`
  position: absolute;
  left: 0;
  ${flexCenter}
  width: ${({ theme, $size }) =>
    theme.sizes.control[$size as keyof typeof theme.sizes.control] || $size};
  height: 100%;
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  z-index: 1;

  & > svg {
    ${({ theme, $size }) =>
      squareIconSize(theme, $size === "xs" || $size === "sm" ? "xs" : "sm")}
  }
`;

const SpinnerWrapper = styled.div<{ $size: ControlSize }>`
  position: absolute;
  right: 0;
  ${flexCenter}
  width: ${({ theme, $size }) =>
    theme.sizes.control[$size as keyof typeof theme.sizes.control] || $size};
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const StyledInput = styled("input", filterProps)<{
  $inputSize: ControlSize;
  $fontSize?: FontSize;
  $isError?: boolean;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}
  ${({ theme, $inputSize, $fontSize }) =>
    controlSizeBase(theme, $inputSize as ControlSize, $fontSize)}

  padding-left: ${({ theme, $inputSize }) =>
    theme.sizes.control[$inputSize as keyof typeof theme.sizes.control] ||
    $inputSize};
  padding-right: ${({ theme, $inputSize }) =>
    theme.sizes.control[$inputSize as keyof typeof theme.sizes.control] ||
    $inputSize};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const DropdownList = styled.ul`
  ${({ theme }) => popoverContentBase(theme)}
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.sizes.offset.popover}px);
  left: 0;
  width: 100%;
  max-height: ${({ theme }) => theme.sizes.component.selectViewportMaxHeight};
  margin: 0;
  padding: ${({ theme }) => theme.spacing.xs};
  list-style: none;
`;

const OptionItem = styled.li`
  ${({ theme }) => popoverItemBase(theme)}
`;

const StatusMessage = styled.li`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.base}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const TextTruncate = styled.span`
  ${textEllipsis}
`;
