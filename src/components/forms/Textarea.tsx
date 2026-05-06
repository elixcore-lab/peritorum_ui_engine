import React, { forwardRef, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  applyTransition,
  controlBorder,
  controlDisabledStyle,
  focusRing,
} from "../../styles";
import { resolveDisabled } from "../../utils";

export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "disabled"
> {
  isError?: boolean;
  autoResize?: boolean;
  showCount?: boolean;
  isDisabled?: boolean;
  maxLength?: number;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledTextarea = styled.textarea<{
  $isError?: boolean;
  $autoResize?: boolean;
}>`
  width: 100%;
  min-height: ${({ theme }) => theme.sizes.component.textareaMinHeight};
  background-color: ${({ theme }) => theme.colors.background.input};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: ${({ theme }) => theme.spacing.base};
  outline: none;
  resize: ${({ $autoResize }) => ($autoResize ? "none" : "vertical")};
  overflow: ${({ $autoResize }) => ($autoResize ? "hidden" : "auto")};

  ${({ theme, $isError }) => controlBorder(theme, $isError)}

  ${({ theme }) =>
    applyTransition(
      theme,
      "border-color, box-shadow, background-color",
      theme.transitions.duration.normal,
      theme.transitions.function.easeInOut,
    )}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, $isError }) =>
      $isError ? theme.colors.status.danger : theme.colors.brand.cyan};
  }

  &:focus {
    ${({ theme, $isError }) => focusRing(theme, $isError)}
  }

  &:disabled {
    ${({ theme }) => controlDisabledStyle(theme)}
  }
`;

const CountIndicator = styled.div<{ $isNearLimit: boolean }>`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, $isNearLimit }) =>
    $isNearLimit ? theme.colors.status.warning : theme.colors.text.secondary};

  ${({ theme }) =>
    applyTransition(
      theme,
      "color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      isError = false,
      autoResize = true,
      showCount = false,
      isDisabled,
      maxLength,
      value,
      defaultValue,
      onChange,
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
    const resolvedDisabled = resolveDisabled({ isDisabled });

    // 비제어/제어 컴포넌트 글자 수 동기화를 위한 상태
    const [textLength, setTextLength] = useState(
      String(value || defaultValue || "").length,
    );

    // 자동 높이 조절 로직
    const handleResize = () => {
      if (!autoResize || !textareaRef.current) return;
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };

    useEffect(() => {
      handleResize();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextLength(e.target.value.length);
      handleResize();
      if (onChange) onChange(e);
    };

    const isNearLimit = maxLength ? textLength >= maxLength * 0.9 : false; // 90% 도달 시 경고 색상
    const presentationProps = { className, style };

    return (
      <Wrapper {...presentationProps}>
        <StyledTextarea
          ref={setTextareaRef}
          $isError={isError}
          $autoResize={autoResize}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={resolvedDisabled}
          {...props}
        />
        {showCount && maxLength && (
          <CountIndicator $isNearLimit={isNearLimit}>
            {textLength} / {maxLength}
          </CountIndicator>
        )}
      </Wrapper>
    );
  },
);

Textarea.displayName = "Textarea";
