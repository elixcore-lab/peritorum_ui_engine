import React, { forwardRef, type ElementType } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { type Spacing } from "../../styles/types";
import { resolveTokenValue } from "../../utils";
import { Box, type BoxProps } from "./Box";

type GridOwnProps = {
  columns?: number | React.CSSProperties["gridTemplateColumns"];
  rows?: number | React.CSSProperties["gridTemplateRows"];
  gap?: Spacing;
  columnGap?: Spacing;
  rowGap?: Spacing;
  autoFitMinWidth?: React.CSSProperties["minWidth"];
  alignItems?: React.CSSProperties["alignItems"];
  justifyItems?: React.CSSProperties["justifyItems"];
};

/**
 * Grid 컴포넌트가 지원하는 CSS grid layout props를 정의합니다.
 *
 * Box의 polymorphic props를 상속하며, grid 전용 prop은 내부 transient prop으로
 * 변환되어 DOM 경고 없이 스타일 계산에만 사용됩니다.
 */
export type GridProps<TElement extends ElementType = "div"> = GridOwnProps &
  Omit<BoxProps<TElement>, keyof GridOwnProps | "display">;

type GridComponent = <TElement extends ElementType = "div">(
  props: GridProps<TElement> & {
    ref?: React.Ref<HTMLElement>;
  },
) => React.ReactElement | null;

const gridFilter = {
  shouldForwardProp: (prop: string) =>
    ![
      "$alignItems",
      "$autoFitMinWidth",
      "$columnGap",
      "$columns",
      "$gap",
      "$justifyItems",
      "$rowGap",
      "$rows",
    ].includes(prop),
};

const StyledGrid = styled(Box, gridFilter)<{
  $columns?: GridOwnProps["columns"];
  $rows?: GridOwnProps["rows"];
  $gap?: Spacing;
  $columnGap?: Spacing;
  $rowGap?: Spacing;
  $autoFitMinWidth?: React.CSSProperties["minWidth"];
  $alignItems?: React.CSSProperties["alignItems"];
  $justifyItems?: React.CSSProperties["justifyItems"];
}>`
  display: grid;
  align-items: ${({ $alignItems }) => $alignItems};
  justify-items: ${({ $justifyItems }) => $justifyItems};
  gap: ${({ theme, $gap }) => resolveTokenValue(theme.spacing, $gap)};
  column-gap: ${({ theme, $columnGap }) =>
    resolveTokenValue(theme.spacing, $columnGap)};
  row-gap: ${({ theme, $rowGap }) => resolveTokenValue(theme.spacing, $rowGap)};

  ${({ theme, $columns, $rows, $autoFitMinWidth }) => {
    const resolvedColumns =
      typeof $columns === "number"
        ? `repeat(${$columns}, minmax(${theme.spacing.none}, 1fr))`
        : $columns;
    const resolvedRows =
      typeof $rows === "number"
        ? `repeat(${$rows}, minmax(${theme.spacing.none}, 1fr))`
        : $rows;

    return css`
      grid-template-columns: ${$autoFitMinWidth
        ? `repeat(auto-fit, minmax(${$autoFitMinWidth}, 1fr))`
        : resolvedColumns};
      grid-template-rows: ${resolvedRows};
    `;
  }}
`;

const GridBase = <TElement extends ElementType = "div">(
  {
    columns,
    rows,
    gap,
    columnGap,
    rowGap,
    autoFitMinWidth,
    alignItems,
    justifyItems,
    ...props
  }: GridProps<TElement>,
  ref: React.Ref<HTMLElement>,
) => {
  return (
    <StyledGrid
      ref={ref}
      $columns={columns}
      $rows={rows}
      $gap={gap}
      $columnGap={columnGap}
      $rowGap={rowGap}
      $autoFitMinWidth={autoFitMinWidth}
      $alignItems={alignItems}
      $justifyItems={justifyItems}
      {...props}
    />
  );
};

/**
 * CSS grid를 위한 polymorphic layout primitive입니다.
 *
 * `columns`, `rows`, `autoFitMinWidth`, gap 계열 prop을 제공하며 ResponsiveGrid 등
 * 상위 adapter 컴포넌트의 기반이 됩니다.
 */
export const Grid = forwardRef(
  GridBase as React.ForwardRefRenderFunction<
    HTMLElement,
    GridProps<ElementType>
  >,
) as GridComponent & { displayName?: string };

Grid.displayName = "Grid";
