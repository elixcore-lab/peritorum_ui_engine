import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { visuallyHidden } from "../../styles/mixins";

/**
 * VisuallyHidden 컴포넌트가 허용하는 표준 span 속성을 정의합니다.
 *
 * 시각적으로는 숨기되 스크린 리더에는 노출되어야 하는 텍스트를 위한 접근성
 * primitive이며, inline style 유입을 막기 위해 `style` prop은 제외합니다.
 */
export interface VisuallyHiddenProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "style"> {}

/**
 * 화면에는 보이지 않지만 보조 기술에는 읽히는 접근성 텍스트 컴포넌트입니다.
 *
 * icon-only button, dialog fallback title, 상태 설명처럼 시각 UI와 접근성 이름을
 * 분리해야 하는 위치에서 사용합니다.
 */
export const VisuallyHidden = forwardRef<
  HTMLSpanElement,
  VisuallyHiddenProps
>(({ children, ...props }, ref) => {
  return (
    <StyledVisuallyHidden ref={ref} {...props}>
      {children}
    </StyledVisuallyHidden>
  );
});

VisuallyHidden.displayName = "VisuallyHidden";

const StyledVisuallyHidden = styled.span`
  ${visuallyHidden}
`;
