import React, { forwardRef } from "react";
import styled from "@emotion/styled";

/**
 * Spacer 컴포넌트가 지원하는 flex 점유 옵션과 표준 div 속성을 정의합니다.
 *
 * 외부 여백을 만들지 않고 flex 레이아웃 안에서 남는 공간을 점유하는 용도로만
 * 사용합니다.
 */
export interface SpacerProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "style"> {
  flex?: React.CSSProperties["flex"];
}

/**
 * Flex 또는 Stack 내부에서 남는 공간을 채우는 layout primitive입니다.
 *
 * 버튼 그룹, header action 정렬처럼 요소 사이의 유연한 빈 공간이 필요할 때 사용합니다.
 */
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ flex, ...props }, ref) => {
    return <StyledSpacer ref={ref} $flex={flex} {...props} />;
  },
);

Spacer.displayName = "Spacer";

const spacerFilter = {
  shouldForwardProp: (prop: string) => prop !== "$flex",
};

const StyledSpacer = styled("div", spacerFilter)<{
  $flex?: React.CSSProperties["flex"];
}>`
  flex: ${({ $flex }) => $flex ?? 1};
  align-self: stretch;
`;
