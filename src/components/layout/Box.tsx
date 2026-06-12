import React, {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";
import styled from "@emotion/styled";
import { type Spacing } from "../../styles/types";
import { resolveTokenValue } from "../../utils";

type BoxOwnProps<TElement extends ElementType> = {
  as?: TElement;
  display?: React.CSSProperties["display"];
  padding?: Spacing;
  backgroundColor?: string;
  width?: React.CSSProperties["width"];
  maxWidth?: React.CSSProperties["maxWidth"];
  minWidth?: React.CSSProperties["minWidth"];
  height?: React.CSSProperties["height"];
  maxHeight?: React.CSSProperties["maxHeight"];
  minHeight?: React.CSSProperties["minHeight"];
  flex?: React.CSSProperties["flex"];
};

/**
 * Box 컴포넌트가 지원하는 polymorphic layout props를 정의합니다.
 *
 * `as`로 렌더링 태그를 바꿀 수 있으며, non-DOM layout prop은 내부에서 transient
 * prop으로 변환되어 실제 DOM 노드에 전달되지 않습니다.
 */
export type BoxProps<TElement extends ElementType = "div"> =
  BoxOwnProps<TElement> &
    Omit<
      ComponentPropsWithoutRef<TElement>,
      keyof BoxOwnProps<TElement> | "color" | "style"
    >;

type BoxComponent = <TElement extends ElementType = "div">(
  props: BoxProps<TElement> & {
    ref?: React.Ref<HTMLElement>;
  },
) => React.ReactElement | null;

const boxFilter = {
  shouldForwardProp: (prop: string) =>
    ![
      "$backgroundColor",
      "$display",
      "$flex",
      "$height",
      "$maxHeight",
      "$maxWidth",
      "$minHeight",
      "$minWidth",
      "$padding",
      "$width",
    ].includes(prop),
};

const StyledBox = styled("div", boxFilter)<{
  $display?: React.CSSProperties["display"];
  $padding?: Spacing;
  $backgroundColor?: string;
  $width?: React.CSSProperties["width"];
  $maxWidth?: React.CSSProperties["maxWidth"];
  $minWidth?: React.CSSProperties["minWidth"];
  $height?: React.CSSProperties["height"];
  $maxHeight?: React.CSSProperties["maxHeight"];
  $minHeight?: React.CSSProperties["minHeight"];
  $flex?: React.CSSProperties["flex"];
}>`
  box-sizing: border-box;
  display: ${({ $display }) => $display};
  flex: ${({ $flex }) => $flex};
  width: ${({ $width }) => $width};
  max-width: ${({ $maxWidth }) => $maxWidth};
  min-width: ${({ $minWidth }) => $minWidth};
  height: ${({ $height }) => $height};
  max-height: ${({ $maxHeight }) => $maxHeight};
  min-height: ${({ $minHeight }) => $minHeight};
  padding: ${({ theme, $padding }) =>
    resolveTokenValue(theme.spacing, $padding)};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
`;

const BoxBase = <TElement extends ElementType = "div">(
  {
    as,
    display,
    padding,
    backgroundColor,
    width,
    maxWidth,
    minWidth,
    height,
    maxHeight,
    minHeight,
    flex,
    ...props
  }: BoxProps<TElement>,
  ref: React.Ref<HTMLElement>,
) => {
  return (
    <StyledBox
      as={as}
      ref={ref as React.Ref<HTMLDivElement>}
      $display={display}
      $padding={padding}
      $backgroundColor={backgroundColor}
      $width={width}
      $maxWidth={maxWidth}
      $minWidth={minWidth}
      $height={height}
      $maxHeight={maxHeight}
      $minHeight={minHeight}
      $flex={flex}
      {...props}
    />
  );
};

/**
 * 모든 layout primitive의 기반이 되는 polymorphic 박스 컴포넌트입니다.
 *
 * spacing token 기반 padding과 sizing prop을 제공하며, 외부 여백은 만들지 않습니다.
 */
export const Box = forwardRef(
  BoxBase as React.ForwardRefRenderFunction<HTMLElement, BoxProps<ElementType>>,
) as BoxComponent & { displayName?: string };

Box.displayName = "Box";
