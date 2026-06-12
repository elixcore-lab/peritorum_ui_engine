import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { type Spacing } from "../../styles/types";
import { Grid, type GridProps } from "./Grid";

export interface ResponsiveGridColumns {
  base: number;
  tablet?: number;
  desktop?: number;
}

/**
 * ResponsiveGrid 컴포넌트가 지원하는 반응형 column 설정을 정의합니다.
 *
 * 순수 Grid primitive를 감싸는 adapter이며, `columns`가 없으면 auto-fit grid로
 * 동작합니다.
 */
export interface ResponsiveGridProps
  extends Omit<GridProps<"div">, "columns" | "gap" | "height" | "padding"> {
  columns?: ResponsiveGridColumns;
  gap?: Spacing;
  spacing?: Spacing;
  minItemWidth?: React.CSSProperties["minWidth"];
  height?: React.CSSProperties["height"];
  padding?: Spacing;
}

const responsiveGridFilter = {
  shouldForwardProp: (prop: string) =>
    !["$columns", "$minItemWidth"].includes(prop),
};

const StyledResponsiveGrid = styled(Grid, responsiveGridFilter)<{
  $columns?: ResponsiveGridColumns;
  $minItemWidth?: React.CSSProperties["minWidth"];
}>`
  ${({ theme, $columns, $minItemWidth }) => {
    if ($columns) {
      const tabletColumns = $columns.tablet ?? $columns.base;

      return css`
        grid-template-columns: repeat(
          ${tabletColumns},
          minmax(${theme.spacing.none}, 1fr)
        );

        ${theme.media.mobile} {
          grid-template-columns: repeat(
            ${$columns.base},
            minmax(${theme.spacing.none}, 1fr)
          );
        }

        ${$columns.desktop &&
        css`
          ${theme.media.desktop} {
            grid-template-columns: repeat(
              ${$columns.desktop},
              minmax(${theme.spacing.none}, 1fr)
            );
          }
        `}
      `;
    }

    return css`
      grid-template-columns: repeat(
        auto-fit,
        minmax(${$minItemWidth || theme.sizes.sidebarWidth}, 1fr)
      );
    `;
  }}
`;

/**
 * 카드/패널 목록을 빠르게 구성하는 반응형 grid adapter입니다.
 *
 * 내부적으로 Grid primitive를 사용해 grid 시스템 파편화를 막고, breakpoint는
 * theme.media 정의를 재사용합니다.
 */
export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  (
    {
      columns,
      gap,
      spacing,
      minItemWidth,
      height = "100%",
      padding,
      width = "100%",
      ...props
    },
    ref,
  ) => {
    return (
      <StyledResponsiveGrid
        ref={ref}
        $columns={columns}
        $minItemWidth={minItemWidth}
        gap={gap ?? spacing ?? "md"}
        height={height}
        padding={padding}
        width={width}
        {...props}
      />
    );
  },
);

ResponsiveGrid.displayName = "ResponsiveGrid";
