import React, { useState, useMemo, useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  applyTransition,
  customScrollbar,
  flexCenter,
  textEllipsis,
  squareIconSize,
  thinBorder,
  absoluteCoverCenter,
} from "../../styles";
import { Spinner } from "../feedback/Spinner";
import {
  getNextSortConfigs,
  getSortDirectionByColumnId,
  multiSort,
  SortConfig,
  SortDirection,
} from "../../utils/SortUtils";
import { useUiConfig } from "../../ConfigProvider";
import { useVirtualScroll } from "../../hooks/useVirtualScroll";

// --- Types (동일) ---
export interface FontItem {
  name?: string;
  size?: string;
  color?: string;
}
export interface CellStyleProps {
  font?: FontItem;
  background?: string;
  padding?: string;
  textAlign?: "center" | "left" | "right";
  borderColor?: string;
}
export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  accessor?: (item: T) => React.ReactNode;
  cell?: (item: T, rowIndex: number, columnIndex: number) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  headerStyle?: CellStyleProps;
  bodyStyle?: CellStyleProps;
}

export interface VirtualScrollTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowHeight?: number;
  overscan?: number;
  selectedItem?: T | null;
  isLoading?: boolean;
  emptyMessage?: string;
  enableClientSort?: boolean;
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T, rowIndex: number) => void;
  onCellClick?: (
    item: T,
    rowIndex: number,
    columnIndex: number,
    columnId: string,
  ) => void;
  onHeaderClick?: (columnId: string, columnIndex: number) => void;
  onSort?: (sortConfigs: SortConfig[]) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  globalHeaderStyle?: CellStyleProps & { height?: string };
  globalBodyStyle?: CellStyleProps;
}

const DEFAULT_ALIGN = "center";

export const VirtualScrollTable = <T,>({
  data,
  columns,
  rowHeight,
  overscan = 10,
  selectedItem,
  isLoading = false,
  emptyMessage,
  enableClientSort = true,
  keyExtractor,
  onRowClick,
  onCellClick,
  onHeaderClick,
  onSort,
  onScrollStart,
  onScrollEnd,
  globalHeaderStyle,
  globalBodyStyle,
}: VirtualScrollTableProps<T>) => {
  const { t } = useUiConfig();
  const theme = useTheme();
  const headerRef = useRef<HTMLDivElement>(null);
  const resolvedRowHeight = rowHeight ?? theme.sizes.component.virtualRowHeight;

  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const precalculatedStyles = useMemo(
    () =>
      columns.map((col) => ({
        header: { ...globalHeaderStyle, ...col.headerStyle },
        body: { ...globalBodyStyle, ...col.bodyStyle },
      })),
    [columns, globalHeaderStyle, globalBodyStyle],
  );

  const sortedData = useMemo(
    () =>
      !enableClientSort || sortConfigs.length === 0
        ? data
        : multiSort(data, sortConfigs),
    [data, sortConfigs, enableClientSort],
  );
  const sortDirectionByColumnId = useMemo(
    () => getSortDirectionByColumnId(sortConfigs),
    [sortConfigs],
  );

  const {
    containerRef,
    startIndex,
    endIndex,
    paddingTop,
    paddingBottom,
    handleScroll,
    scrollTop,
    viewportHeight,
  } = useVirtualScroll({
    itemCount: sortedData.length,
    rowHeight: resolvedRowHeight,
    overscan,
  });

  // 4. 헤더-바디 동기화 및 이벤트 처리
  const onContainerScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      handleScroll(e);
      if (headerRef.current)
        headerRef.current.scrollLeft = e.currentTarget.scrollLeft;

      // 스크롤 시작/끝 감지 로직 유지
      const { scrollTop: top, scrollHeight, clientHeight } = e.currentTarget;
      if (top === 0 && onScrollStart) onScrollStart();
      else if (scrollHeight - top <= clientHeight + 10 && onScrollEnd)
        onScrollEnd();
    },
    [handleScroll, onScrollStart, onScrollEnd],
  );

  const onHandleSort = useCallback(
    (e: React.MouseEvent, columnId: string, sortable?: boolean) => {
      if (!sortable) return;
      const next = getNextSortConfigs(sortConfigs, columnId, e.shiftKey);
      setSortConfigs(next);
      if (onSort) onSort(next);
    },
    [sortConfigs, onSort],
  );

  const getCellData = (
    item: T,
    rowIndex: number,
    columnIndex: number,
    column: ColumnDef<T>,
  ) => {
    if (column.cell) return column.cell(item, rowIndex, columnIndex);
    if (column.accessor) return column.accessor(item);
    return String((item as Record<string, unknown>)[column.id] ?? "");
  };

  return (
    <TableContainer role="table">
      <HeaderWrapper
        ref={headerRef}
        role="rowgroup"
        $height={globalHeaderStyle?.height}
      >
        <Row role="row" $isHeader>
          {columns.map((col, idx) => {
            const direction = sortDirectionByColumnId.get(col.id);
            const style = precalculatedStyles[idx].header;
            return (
              <HeaderCell
                key={col.id}
                role="columnheader"
                aria-sort={
                  !col.sortable
                    ? undefined
                    : direction === SortDirection.ASC
                      ? "ascending"
                      : direction === SortDirection.DESC
                        ? "descending"
                        : "none"
                }
                $width={col.width}
                $sortable={col.sortable}
                $customStyle={style}
                onClick={(e) => {
                  if (onHeaderClick) onHeaderClick(col.id, idx);
                  onHandleSort(e, col.id, col.sortable);
                }}
              >
                <CellContent $align={style.textAlign || DEFAULT_ALIGN}>
                  <TextTruncate>{col.header}</TextTruncate>
                  {col.sortable && (
                    <SortIndicator $active={!!direction}>
                      {direction === SortDirection.ASC ? (
                        <SortIcon as={ArrowUp} />
                      ) : direction === SortDirection.DESC ? (
                        <SortIcon as={ArrowDown} />
                      ) : (
                        <SortIcon as={ArrowUpDown} />
                      )}
                    </SortIndicator>
                  )}
                </CellContent>
              </HeaderCell>
            );
          })}
        </Row>
      </HeaderWrapper>

      <BodyScrollWrapper
        ref={containerRef}
        onScroll={onContainerScroll}
        role="rowgroup"
      >
        {isLoading && (
          <LoadingOverlay>
            <Spinner size={theme.sizes.icon.loading} />
          </LoadingOverlay>
        )}
        {sortedData.length === 0 ? (
          <EmptyRow role="row">
            <EmptyCell role="cell">
              {isLoading ? "" : emptyMessage || t("common.noData")}
            </EmptyCell>
          </EmptyRow>
        ) : (
          <>
            {paddingTop > 0 && <SpacerDiv $height={paddingTop} />}
            {sortedData.slice(startIndex, endIndex).map((item, i) => {
              const actualIndex = startIndex + i;
              return (
                <Row
                  key={keyExtractor(item, actualIndex)}
                  role="row"
                  $active={selectedItem === item}
                  $rowHeight={resolvedRowHeight}
                  onClick={() => onRowClick && onRowClick(item, actualIndex)}
                >
                  {columns.map((col, colIdx) => {
                    const style = precalculatedStyles[colIdx].body;
                    const cellData = getCellData(
                      item,
                      actualIndex,
                      colIdx,
                      col,
                    );
                    return (
                      <DataCell
                        key={col.id}
                        role="cell"
                        $width={col.width}
                        $customStyle={style}
                        onClick={(e) => {
                          if (onCellClick) {
                            e.stopPropagation();
                            onCellClick(item, actualIndex, colIdx, col.id);
                          }
                        }}
                      >
                        <CellContent $align={style.textAlign || DEFAULT_ALIGN}>
                          {React.isValidElement(cellData) ? (
                            cellData
                          ) : (
                            <TextTruncate>{cellData}</TextTruncate>
                          )}
                        </CellContent>
                      </DataCell>
                    );
                  })}
                </Row>
              );
            })}
            {paddingBottom > 0 && <SpacerDiv $height={paddingBottom} />}
          </>
        )}
      </BodyScrollWrapper>
    </TableContainer>
  );
};

// --- Styled Components (믹스인 적용으로 다이어트) ---

const TableContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  ${({ theme }) => thinBorder(theme)}
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.surface};
`;

const HeaderWrapper = styled.div<{ $height?: string }>`
  flex-shrink: 0;
  height: ${({ $height }) => $height || "auto"};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.hover};
  ${({ theme }) => thinBorder(theme, "bottom")}
`;

const BodyScrollWrapper = styled.div`
  flex: 1;
  overflow: auto;
  position: relative;
  ${({ theme }) => customScrollbar(theme)}
`;

const Row = styled.div<{
  $isHeader?: boolean;
  $active?: boolean;
  $rowHeight?: number;
}>`
  display: flex;
  min-width: 100%;
  width: max-content;
  height: ${({ $rowHeight }) => ($rowHeight ? `${$rowHeight}px` : "auto")};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.statusBg.info : theme.colors.utility.transparent};
  cursor: ${({ $isHeader }) => ($isHeader ? "default" : "pointer")};
  ${({ $isHeader, theme }) => !$isHeader && thinBorder(theme, "bottom")}
  ${({ theme }) => applyTransition(theme, "background-color")}
  &:hover {
    background-color: ${({ $isHeader, $active, theme }) =>
      $isHeader
        ? "transparent"
        : $active
          ? theme.colors.statusBg.info
          : theme.colors.background.hover};
  }
`;

const BaseCell = styled.div<{ $width?: string; $customStyle?: CellStyleProps }>`
  flex: ${({ $width }) => ($width ? "none" : 1)};
  width: ${({ $width }) => $width || "auto"};
  display: flex;
  align-items: center;
  padding: ${({ $customStyle, theme }) =>
    $customStyle?.padding || `0 ${theme.spacing.sm}`};
  background-color: ${({ $customStyle, theme }) =>
    $customStyle?.background || "transparent"};
  font-family: ${({ $customStyle }) => $customStyle?.font?.name || "inherit"};
  font-size: ${({ $customStyle }) => $customStyle?.font?.size || "inherit"};
  color: ${({ $customStyle }) => $customStyle?.font?.color || "inherit"};
  ${({ $customStyle, theme }) =>
    $customStyle?.borderColor &&
    css`
      border-right: ${theme.sizes.component.dividerThin} solid
        ${$customStyle.borderColor};
    `}
`;

const HeaderCell = styled(BaseCell)<{ $sortable?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $customStyle }) =>
    $customStyle?.font?.color || theme.colors.text.secondary};
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;
  ${({ theme }) => applyTransition(theme, "background-color, color")}
  &:hover {
    color: ${({ $sortable, theme }) =>
      $sortable ? theme.colors.text.primary : "inherit"};
  }
`;

const DataCell = styled(BaseCell)``;

const CellContent = styled.div<{ $align?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: ${({ $align }) =>
    $align === "right"
      ? "flex-end"
      : $align === "left"
        ? "flex-start"
        : "center"};
`;

const TextTruncate = styled.span`
  ${textEllipsis}
`;

const SortIndicator = styled.div<{ $active: boolean }>`
  ${flexCenter};
  flex-shrink: 0;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.cyan : theme.colors.text.disabled};
  ${({ theme }) => applyTransition(theme, "color")}
`;

const SortIcon = styled.svg`
  ${({ theme }) => squareIconSize(theme, "xs")}
`;

const EmptyRow = styled.div`
  ${absoluteCoverCenter}
  height: ${({ theme }) => theme.sizes.component.emptyStateHeight};
`;

const EmptyCell = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SpacerDiv = styled.div<{ $height: number }>`
  height: ${({ $height }) => `${$height}px`};
`;

const LoadingOverlay = styled.div`
  ${absoluteCoverCenter}
  z-index: ${({ theme }) => theme.zIndices.sticky};
  background-color: ${({ theme }) => theme.colors.background.loadingOverlay};
  backdrop-filter: blur(${({ theme }) => theme.sizes.component.overlayBlur});
`;
