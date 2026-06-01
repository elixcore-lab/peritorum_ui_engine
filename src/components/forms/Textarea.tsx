import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  applyTransition,
  formControlBase,
  customScrollbar,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  autoResize?: boolean;
  showCount?: boolean;
  minRows?: number;
  maxRows?: number;
  onSubmitOnEnter?: () => void;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      isError = false,
      autoResize = true,
      showCount = false,
      disabled,
      maxLength,
      minRows = 3,
      maxRows,
      value,
      defaultValue,
      onChange,
      onKeyDown,
      onSubmitOnEnter,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const setTextareaRef = (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const trulyDisabled = resolveDisabled({ disabled });

    const [textLength, setTextLength] = useState(
      String(value || defaultValue || "").length,
    );

    const handleResize = () => {
      if (!autoResize || !textareaRef.current) return;
      const textarea = textareaRef.current;

      textarea.style.height = "auto";
      const nextHeight = textarea.scrollHeight;
      textarea.style.height = `${nextHeight}px`;

      if (maxRows) {
        const computedStyle = window.getComputedStyle(textarea);
        const maxHeight = parseFloat(computedStyle.maxHeight);
        if (nextHeight >= maxHeight) {
          textarea.style.overflowY = "auto";
        } else {
          textarea.style.overflowY = "hidden";
        }
      }
    };

    useEffect(() => {
      handleResize();
    }, [value, autoResize, maxRows]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextLength(e.target.value.length);
      handleResize();
      if (onChange) onChange(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onSubmitOnEnter && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmitOnEnter();
      }
      if (onKeyDown) onKeyDown(e);
    };

    const isNearLimit = maxLength ? textLength >= maxLength * 0.9 : false;
    const presentationProps = { className, style };

    return (
      <TextareaWrapper {...presentationProps}>
        <StyledTextarea
          ref={setTextareaRef}
          $isError={isError}
          $autoResize={autoResize}
          $maxRows={maxRows}
          rows={minRows}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={trulyDisabled}
          aria-invalid={isError}
          {...props}
        />
        {showCount && maxLength && (
          <TextareaCount $isNearLimit={isNearLimit} $disabled={trulyDisabled}>
            {textLength} / {maxLength}
          </TextareaCount>
        )}
      </TextareaWrapper>
    );
  },
);

Textarea.displayName = "Textarea";

// --- Styled Components ---

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledTextarea = styled.textarea<{
  $isError?: boolean;
  $autoResize?: boolean;
  $maxRows?: number;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}
  ${({ theme }) => customScrollbar(theme)} 

  padding: ${({ theme }) => theme.spacing.base};
  line-height: 1.5;
  resize: ${({ $autoResize }) => ($autoResize ? "none" : "vertical")};
  overflow-y: ${({ $autoResize }) => ($autoResize ? "hidden" : "auto")};

  ${({ theme, $maxRows }) =>
    $maxRows &&
    css`
      max-height: calc(${$maxRows} * 1.5em + (${theme.spacing.base} * 2));
    `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const TextareaCount = styled.div<{
  $isNearLimit: boolean;
  $disabled?: boolean;
}>`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.fontSizes.xs};

  color: ${({ theme, $isNearLimit, $disabled }) =>
    $disabled
      ? theme.colors.text.disabled
      : $isNearLimit
        ? theme.colors.status.warning
        : theme.colors.text.secondary};

  ${({ theme }) =>
    applyTransition(
      theme,
      "color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
`;
