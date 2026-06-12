import React, { forwardRef, type ElementType } from "react";
import { type Spacing } from "../../styles/types";
import { Flex, type FlexProps } from "./Flex";

const FlexPrimitive = Flex as (
  props: FlexProps<ElementType> & {
    ref?: React.Ref<HTMLElement>;
  },
) => React.ReactElement | null;

type StackOwnProps = {
  direction?: React.CSSProperties["flexDirection"];
  gap?: Spacing;
};

/**
 * Stack 컴포넌트가 지원하는 흐름 방향과 간격 prop을 정의합니다.
 *
 * Public API에서는 `$` prefix를 사용하지 않으며, 내부적으로 Flex primitive를 통해
 * transient prop 필터링을 적용합니다.
 */
export type StackProps<TElement extends ElementType = "div"> = StackOwnProps &
  Omit<FlexProps<TElement>, keyof StackOwnProps>;

type StackComponent = <TElement extends ElementType = "div">(
  props: StackProps<TElement> & {
    ref?: React.Ref<HTMLElement>;
  },
) => React.ReactElement | null;

const StackBase = <TElement extends ElementType = "div">(
  {
    direction = "column",
    gap = "sm",
    width,
    flex,
    ...props
}: StackProps<TElement>,
  ref: React.Ref<HTMLElement>,
) => {
  const flexProps = props as FlexProps<ElementType>;

  return (
    <FlexPrimitive
      {...flexProps}
      ref={ref}
      direction={direction}
      gap={gap}
      width={flex ? width : (width ?? "100%")}
      flex={flex}
    />
  );
};

/**
 * 수직/수평 흐름과 gap을 제어하는 기본 layout primitive입니다.
 *
 * 컴포넌트 간 간격은 외부 여백이 아니라 Stack의 gap과 부모 padding으로 제어합니다.
 */
export const Stack = forwardRef(
  StackBase as React.ForwardRefRenderFunction<
    HTMLElement,
    StackProps<ElementType>
  >,
) as StackComponent & { displayName?: string };

Stack.displayName = "Stack";
