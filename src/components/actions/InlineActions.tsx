import React, { forwardRef } from "react";
import { Stack, type StackProps } from "../layout/Stack";

/**
 * InlineActions 컴포넌트가 지원하는 action group layout props를 정의합니다.
 *
 * Stack props를 기반으로 하며, 기본적으로 가로 방향과 중앙 정렬을 사용합니다.
 */
export interface InlineActionsProps extends StackProps<"div"> {}

/**
 * 버튼이나 아이콘 버튼처럼 한 줄에 배치되는 액션 묶음을 위한 preset입니다.
 *
 * layout 도메인의 primitive를 action composition 용도로 감싸 제공합니다.
 */
export const InlineActions = forwardRef<HTMLDivElement, InlineActionsProps>(
  ({ direction = "row", align = "center", ...props }, ref) => {
    return (
      <Stack ref={ref} direction={direction} align={align} {...props} />
    );
  },
);

InlineActions.displayName = "InlineActions";
