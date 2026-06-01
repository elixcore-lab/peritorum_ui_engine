import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { Search } from "lucide-react";
import { useTheme } from "@emotion/react";
import {
  formControlBase,
  textEllipsis,
  popoverContentBase,
  flexCenter,
  popoverItemBase,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { useDebounce } from "../../hooks/useDebounce";
import { useOnClickOutside } from "../../hooks";
import { Spinner } from "../feedback/Spinner";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  placeholder?: string;
  options: ComboboxOption[];
  isLoading?: boolean;
  onSearch?: (keyword: string) => void;
  onSelect?: (option: ComboboxOption) => void;
}

export const Autocomplete = ({
  placeholder,
  options,
  isLoading = false,
  onSearch,
  onSelect,
}: AutocompleteProps) => {
  const theme = useTheme();
  const { t } = useUiConfig();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedKeyword = useDebounce(inputValue, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedKeyword);
    }
  }, [debouncedKeyword, onSearch]);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
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
        <SearchIcon size={theme.sizes.icon.sm} />
        <StyledInput
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t("ui.component.select.placeholder")}
        />
        {isLoading && (
          <SpinnerWrapper>
            <Spinner size="sm" />
          </SpinnerWrapper>
        )}
      </InputWrapper>

      {isOpen && (
        <DropdownList>
          {isLoading ? (
            <StatusMessage>
              {t("ui.component.combobox.searching")}
            </StatusMessage>
          ) : options.length > 0 ? (
            options.map((option) => (
              <OptionItem
                key={option.value}
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
};

// --- Styled Components ---

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  ${({ theme }) => formControlBase(theme)}
  height: ${({ theme }) => theme.sizes.control.md};
  padding-left: ${({ theme }) =>
    `calc(${theme.sizes.icon.sm} + ${theme.spacing.md})`};
  padding-right: ${({ theme }) =>
    `calc(${theme.sizes.icon.sm} + ${theme.spacing.md})`};
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  ${flexCenter}
  pointer-events: none;
`;

const DropdownList = styled.ul`
  ${({ theme }) => popoverContentBase(theme)}
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
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
