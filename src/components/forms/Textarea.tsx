import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { type ControlSize, type FontSize } from "../../styles/types";
import {
  applyTransition,
  formControlBase,
  customScrollbar,
} from "../../styles/mixins";
import { resolveDisabled } from "../../utils";

/**
 * Textarea의 크기, 상태, 자동 높이 조절, 글자 수 표시 옵션을 정의합니다.
 *
 * 디자인 시스템 규칙상 inline style 유입을 막기 위해 native `style` prop은 제외합니다.
 */
export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size" | "style"
> {
  size?: ControlSize;
  fontSize?: FontSize;
  isError?: boolean;
  autoResize?: boolean;
  showCount?: boolean;
  minRows?: number;
  maxRows?: number;
  onSubmitOnEnter?: () => void;
}

/**
 * 여러 줄 텍스트 입력을 위한 form control 컴포넌트입니다.
 *
 * 자동 높이 조절, 최대 행 수 제한, Enter submit 패턴, 글자 수 카운트를 지원하며
 * ref는 실제 textarea 엘리먼트로 전달됩니다.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = "md",
      fontSize,
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
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const resizeFrameRef = useRef<number>();

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
      String(value ?? defaultValue ?? "").length,
    );
    const [autoHeight, setAutoHeight] = useState<string>();
    const [autoOverflowY, setAutoOverflowY] =
      useState<React.CSSProperties["overflowY"]>();

    const handleResize = useCallback(() => {
      if (!autoResize || !textareaRef.current) {
        setAutoHeight(undefined);
        setAutoOverflowY(undefined);
        return;
      }

      if (resizeFrameRef.current) {
        window.cancelAnimationFrame(resizeFrameRef.current);
      }

      setAutoHeight(undefined);

      resizeFrameRef.current = window.requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const nextHeight = textarea.scrollHeight;
        setAutoHeight(`${nextHeight}px`);

        if (!maxRows) {
          setAutoOverflowY("hidden");
          return;
        }

        const computedStyle = window.getComputedStyle(textarea);
        const maxHeight = parseFloat(computedStyle.maxHeight);
        setAutoOverflowY(nextHeight >= maxHeight ? "auto" : "hidden");
      });
    }, [autoResize, maxRows]);

    useEffect(() => {
      handleResize();
      return () => {
        if (resizeFrameRef.current) {
          window.cancelAnimationFrame(resizeFrameRef.current);
        }
      };
    }, [handleResize, value]);

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

    return (
      <TextareaWrapper className={className}>
        <StyledTextarea
          ref={setTextareaRef}
          $inputSize={size}
          $fontSize={fontSize}
          $isError={isError}
          $autoResize={autoResize}
          $autoHeight={autoHeight}
          $autoOverflowY={autoOverflowY}
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

// ==========================================
// Styled Components
// ==========================================

// 💡 1. DOM 에러(프롭 누수) 완벽 차단
const textareaFilter = {
  shouldForwardProp: (prop: string) =>
    ![
      "$inputSize",
      "$fontSize",
      "$isError",
      "$autoResize",
      "$autoHeight",
      "$autoOverflowY",
      "$maxRows",
    ].includes(prop),
};

const countFilter = {
  shouldForwardProp: (prop: string) =>
    !["$isNearLimit", "$disabled"].includes(prop),
};

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StyledTextarea = styled("textarea", textareaFilter)<{
  $inputSize: ControlSize | (string & {});
  $fontSize?: FontSize | (string & {});
  $isError?: boolean;
  $autoResize?: boolean;
  $autoHeight?: string;
  $autoOverflowY?: React.CSSProperties["overflowY"];
  $maxRows?: number;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}
  ${({ theme }) => customScrollbar(theme)} 

  /* 💡 2. Input 컴포넌트와 시각적 일관성을 맞추기 위한 동적 사이즈 매핑 */
  ${({ theme, $inputSize, $fontSize }) => {
    // 안전한 폴백 처리
    const safeSize = theme.sizes.control[
      $inputSize as keyof typeof theme.sizes.control
    ]
      ? $inputSize
      : "md";
    const refSize = safeSize as "xs" | "sm" | "md" | "lg" | "xl";

    const paddingY = {
      xs: theme.spacing["2xs"],
      sm: theme.spacing.xs,
      md: theme.spacing.sm,
      lg: theme.spacing.md,
      xl: theme.spacing.lg,
    }[refSize];

    const paddingX = {
      xs: theme.spacing.sm,
      sm: theme.spacing.base,
      md: theme.spacing.md,
      lg: theme.spacing.md,
      xl: theme.spacing.lg,
    }[refSize];

    const finalFontSize = $fontSize
      ? theme.fontSizes[$fontSize as keyof typeof theme.fontSizes] || $fontSize
      : {
          xs: theme.fontSizes["2xs"],
          sm: theme.fontSizes.sm,
          md: theme.fontSizes.base,
          lg: theme.fontSizes.lg,
          xl: theme.fontSizes.xl,
        }[refSize];

    return css`
      padding: ${paddingY} ${paddingX};
      font-size: ${finalFontSize};
    `;
  }}

  line-height: ${({ theme }) => theme.lineHeights.comfortable};
  resize: ${({ $autoResize }) => ($autoResize ? "none" : "vertical")};
  height: ${({ $autoResize, $autoHeight }) =>
    $autoResize ? ($autoHeight ?? "auto") : undefined};
  overflow-y: ${({ $autoResize, $autoOverflowY }) =>
    $autoResize ? ($autoOverflowY ?? "hidden") : "auto"};

  ${({ theme, $maxRows, $inputSize }) => {
    if (!$maxRows) return null;

    // 💡 3. 하드코딩된 패딩 연산 대신, 동적 연산을 통해 max-height를 정확히 제어
    const safeSize = theme.sizes.control[
      $inputSize as keyof typeof theme.sizes.control
    ]
      ? $inputSize
      : "md";
    const refSize = safeSize as "xs" | "sm" | "md" | "lg" | "xl";

    const paddingY = {
      xs: theme.spacing["2xs"],
      sm: theme.spacing.xs,
      md: theme.spacing.sm,
      lg: theme.spacing.md,
      xl: theme.spacing.lg,
    }[refSize];

    return css`
      max-height: calc(
        ${$maxRows} * ${theme.lineHeights.comfortable}em + (${paddingY} * 2)
      );
    `;
  }}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const TextareaCount = styled("div", countFilter)<{
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
