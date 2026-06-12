import React, { forwardRef, type ElementType } from "react";
import styled from "@emotion/styled";
import { type Spacing } from "../../styles/types";
import { resolveTokenValue } from "../../utils";
import { Box, type BoxProps } from "./Box";

type FlexOwnProps = {
  direction?: React.CSSProperties["flexDirection"];
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  gap?: Spacing;
  wrap?: React.CSSProperties["flexWrap"];
};

/**
 * Flex 컴포넌트가 지원하는 flex layout props를 정의합니다.
 *
 * Box의 polymorphic props를 상속하며, flex 전용 prop은 내부 transient prop으로
 * 변환되어 DOM에 전달되지 않습니다.
 */
export type FlexProps<TElement extends ElementType = "div"> =
  FlexOwnProps & Omit<BoxProps<TElement>, keyof FlexOwnProps | "display">;

type FlexComponent = <TElement extends ElementType = "div">(
  props: FlexProps<TElement> & {
    ref?: React.Ref<HTMLElement>;
  },
) => React.ReactElement | null;

const flexFilter = {
  shouldForwardProp: (prop: string) =>
    !["$align", "$direction", "$gap", "$justify", "$wrap"].includes(prop),
};

const StyledFlex = styled(Box, flexFilter)<{
  $direction?: React.CSSProperties["flexDirection"];
  $align?: React.CSSProperties["alignItems"];
  $justify?: React.CSSProperties["justifyContent"];
  $gap?: Spacing;
  $wrap?: React.CSSProperties["flexWrap"];
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $align }) => $align};
  justify-content: ${({ $justify }) => $justify};
  flex-wrap: ${({ $wrap }) => $wrap};
  gap: ${({ theme, $gap }) => resolveTokenValue(theme.spacing, $gap)};
`;

const FlexBase = <TElement extends ElementType = "div">(
  {
    direction,
    align,
    justify,
    gap,
    wrap,
    ...props
  }: FlexProps<TElement>,
  ref: React.Ref<HTMLElement>,
) => {
  return (
    <StyledFlex
      ref={ref}
      $direction={direction}
      $align={align}
      $justify={justify}
      $gap={gap}
      $wrap={wrap}
      {...props}
    />
  );
};

/**
 * 수평/수직 정렬과 gap을 다루는 polymorphic flex primitive입니다.
 *
 * 컴포넌트 자체는 외부 여백을 만들지 않으며, spacing은 theme token 기반 gap과
 * padding으로만 제어합니다.
 */
export const Flex = forwardRef(
  FlexBase as React.ForwardRefRenderFunction<
    HTMLElement,
    FlexProps<ElementType>
  >,
) as FlexComponent & { displayName?: string };

Flex.displayName = "Flex";
