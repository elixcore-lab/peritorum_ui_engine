import React, {
  useCallback,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  applyTransition,
  customScrollbar,
  flexCenter,
  textEllipsis,
} from "../../styles";
import { Spinner } from "../feedback/Spinner";
import {
  multiSort,
  type SortConfig,
  SortDirection,
} from "../../utils/SortUtils";
import { useUiConfig } from "../../ConfigProvider";

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

const getSortDirectionByColumnId = (sortConfigs: SortConfig[]) => {
  const directionByColumnId = new Map<string, SortDirection>();

  for (const { id, direction } of sortConfigs) {
    directionByColumnId.set(id, direction);
  }

  return directionByColumnId;
};

const getNextSortConfigs = (
  currentConfigs: SortConfig[],
  columnId: string,
  isMultiSort: boolean,
) => {
  const existingIndex = currentConfigs.findIndex(
    (config) => config.id === columnId,
  );

  if (isMultiSort) {
    if (existingIndex === -1) {
      return [
        ...currentConfigs,
        { id: columnId, direction: SortDirection.DESC },
      ];
    }

    const currentConfig = currentConfigs[existingIndex];

    if (currentConfig.direction === SortDirection.DESC) {
      const nextConfigs = currentConfigs.slice();
      nextConfigs[existingIndex] = {
        ...currentConfig,
        direction: SortDirection.ASC,
      };
      return nextConfigs;
    }

    const nextConfigs = currentConfigs.slice();
    nextConfigs.splice(existingIndex, 1);
    return nextConfigs;
  }

  if (existingIndex >= 0 && currentConfigs.length === 1) {
    return currentConfigs[0].direction === SortDirection.DESC
      ? [{ id: columnId, direction: SortDirection.ASC }]
      : [];
  }

  return [{ id: columnId, direction: SortDirection.DESC }];
};

const getSortIcon = (direction?: SortDirection) => {
  if (!direction) return <SortIcon as={ArrowUpDown} />;
  if (direction === SortDirection.ASC) return <SortIcon as={ArrowUp} />;
  return <SortIcon as={ArrowDown} />;
};

const getCellData = <T,>(
  item: T,
  rowIndex: number,
  columnIndex: number,
  column: ColumnDef<T>,
) => {
  if (column.cell) return column.cell(item, rowIndex, columnIndex);
  if (column.accessor) return column.accessor(item);
  return String((item as Record<string, unknown>)[column.id] ?? "");
};

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
  const resolvedRowHeight = rowHeight ?? theme.sizes.component.virtualRowHeight;
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const prevScrollHeightRef = useRef<number>(0);
  const prevDataLengthRef = useRef<number>(0);

  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

  const defaultEmptyMessage = useMemo(() => t("common.noData"), [t]);
  const resolvedEmptyMessage = emptyMessage || defaultEmptyMessage;

  const sortedData = useMemo(() => {
    if (!enableClientSort || sortConfigs.length === 0) return data;
    return multiSort(data, sortConfigs);
  }, [data, sortConfigs, enableClientSort]);

  const sortDirectionByColumnId = useMemo(
    () => getSortDirectionByColumnId(sortConfigs),
    [sortConfigs],
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      setViewportHeight(containerRef.current.clientHeight);
    }
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    if (
      prevDataLengthRef.current > 0 &&
      sortedData.length > prevDataLengthRef.current &&
      scrollTop === 0
    ) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const diff = newScrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop += diff;
    }

    if (prevDataLengthRef.current === 0 && sortedData.length > 0) {
      containerRef.current.scrollTop = 0;
      if (scrollTop !== 0) {
        setTimeout(() => setScrollTop(0), 0);
      }
    }

    prevScrollHeightRef.current = containerRef.current.scrollHeight;
    prevDataLengthRef.current = sortedData.length;
  }, [sortedData.length, scrollTop]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalItems = sortedData.length;
  const { startIndex, endIndex, paddingTop, paddingBottom } = useMemo(() => {
    const nextStartIndex = Math.max(
      0,
      Math.floor(scrollTop / resolvedRowHeight) - overscan,
    );
    const nextEndIndex = Math.min(
      totalItems,
      Math.ceil((scrollTop + viewportHeight) / resolvedRowHeight) + overscan,
    );

    return {
      startIndex: nextStartIndex,
      endIndex: nextEndIndex,
      paddingTop: nextStartIndex * resolvedRowHeight,
      paddingBottom: (totalItems - nextEndIndex) * resolvedRowHeight,
    };
  }, [overscan, resolvedRowHeight, scrollTop, totalItems, viewportHeight]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const {
        scrollTop: currentScrollTop,
        scrollLeft,
        scrollHeight,
        clientHeight,
      } = e.currentTarget;
      setScrollTop(currentScrollTop);

      if (headerRef.current) {
        headerRef.current.scrollLeft = scrollLeft;
      }

      if (currentScrollTop === 0 && onScrollStart) {
        onScrollStart();
      } else if (
        scrollHeight - currentScrollTop <= clientHeight + 10 &&
        onScrollEnd
      ) {
        onScrollEnd();
      }
    },
    [onScrollStart, onScrollEnd],
  );

  const handleSort = useCallback(
    (e: React.MouseEvent, columnId: string, sortable?: boolean) => {
      if (!sortable) return;

      const nextConfigs = getNextSortConfigs(sortConfigs, columnId, e.shiftKey);
      setSortConfigs(nextConfigs);
      if (onSort) onSort(nextConfigs);
    },
    [sortConfigs, onSort],
  );

  const renderVisibleRows = () => {
    const rows: React.ReactNode[] = [];

    for (let actualIndex = startIndex; actualIndex < endIndex; actualIndex++) {
      const item = sortedData[actualIndex];

      rows.push(
        <Row
          key={keyExtractor(item, actualIndex)}
          role="row"
          $active={selectedItem === item}
          $rowHeight={resolvedRowHeight}
          onClick={() => onRowClick && onRowClick(item, actualIndex)}
        >
          {columns.map((col, columnIndex) => {
            const mergedStyle = {
              ...globalBodyStyle,
              ...col.bodyStyle,
            };
            const cellData = getCellData(item, actualIndex, columnIndex, col);

            return (
              <DataCell
                key={`body-${actualIndex}-${col.id}`}
                role="cell"
                $width={col.width}
                $customStyle={mergedStyle}
                onClick={(e) => {
                  if (onCellClick) {
                    e.stopPropagation();
                    onCellClick(item, actualIndex, columnIndex, col.id);
                  }
                }}
              >
                <CellContent $align={mergedStyle.textAlign || DEFAULT_ALIGN}>
                  {React.isValidElement(cellData) ? (
                    cellData
                  ) : (
                    <TextTruncate>{cellData}</TextTruncate>
                  )}
                </CellContent>
              </DataCell>
            );
          })}
        </Row>,
      );
    }

    return rows;
  };

  return (
    <TableContainer role="table">
      <HeaderWrapper
        ref={headerRef}
        role="rowgroup"
        $height={globalHeaderStyle?.height}
      >
        <Row role="row" $isHeader>
          {columns.map((col, columnIndex) => {
            const sortDirection = sortDirectionByColumnId.get(col.id);
            const isSorted = Boolean(sortDirection);
            const mergedStyle = { ...globalHeaderStyle, ...col.headerStyle };

            return (
              <HeaderCell
                key={`header-${col.id}`}
                role="columnheader"
                $width={col.width}
                $sortable={col.sortable}
                $customStyle={mergedStyle}
                onClick={(e) => {
                  if (onHeaderClick) onHeaderClick(col.id, columnIndex);
                  handleSort(e, col.id, col.sortable);
                }}
              >
                <CellContent $align={mergedStyle.textAlign || DEFAULT_ALIGN}>
                  <TextTruncate>{col.header}</TextTruncate>
                  {col.sortable && (
                    <SortIndicator $active={isSorted}>
                      {getSortIcon(sortDirection)}
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
        onScroll={handleScroll}
        role="rowgroup"
      >
        {isLoading && (
          <LoadingOverlay>
            <Spinner size={theme.sizes.icon.loading} />
          </LoadingOverlay>
        )}

        {totalItems === 0 ? (
          <EmptyRow role="row">
            <EmptyCell role="cell">
              {isLoading ? "" : resolvedEmptyMessage}
            </EmptyCell>
          </EmptyRow>
        ) : (
          <>
            {paddingTop > 0 && <SpacerDiv $height={paddingTop} />}

            {renderVisibleRows()}

            {paddingBottom > 0 && <SpacerDiv $height={paddingBottom} />}
          </>
        )}
      </BodyScrollWrapper>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.surface};
  position: relative;
`;

const HeaderWrapper = styled.div<{ $height?: string }>`
  flex-shrink: 0;
  height: ${({ $height }) => $height || "auto"};
  background-color: ${({ theme }) => theme.colors.background.hover};
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  overflow: hidden;
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
  border-bottom: ${({ $isHeader, theme }) =>
    $isHeader
      ? "none"
      : `${theme.sizes.component.dividerThin} solid ${theme.colors.border.divider}`};

  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  &:hover {
    background-color: ${({ $isHeader, $active, theme }) =>
      $isHeader
        ? theme.colors.utility.transparent
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
    $customStyle?.background || theme.colors.utility.transparent};
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
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme, $customStyle }) =>
    $customStyle?.font?.size || theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $customStyle }) =>
    $customStyle?.font?.color || theme.colors.text.secondary};
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};
  user-select: none;

  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color, color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  &:hover {
    background-color: ${({ theme, $sortable, $customStyle }) =>
      $sortable
        ? theme.colors.background.hover
        : $customStyle?.background || theme.colors.utility.transparent};
    color: ${({ theme, $sortable }) =>
      $sortable ? theme.colors.text.primary : "inherit"};
  }
`;

const DataCell = styled(BaseCell)`
  font-size: ${({ theme, $customStyle }) =>
    $customStyle?.font?.size || theme.fontSizes.sm};
  color: ${({ theme, $customStyle }) =>
    $customStyle?.font?.color || theme.colors.text.primary};
`;

const CellContent = styled.div<{ $align?: string }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === "right"
      ? "flex-end"
      : $align === "left"
        ? "flex-start"
        : "center"};
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  min-width: 0;
`;

const TextTruncate = styled.span`
  ${textEllipsis}
`;

const SortIndicator = styled.div<{ $active: boolean }>`
  ${flexCenter};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.brand.cyan : theme.colors.text.disabled};
  ${({ theme }) =>
    applyTransition(
      theme,
      "color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
  flex-shrink: 0;
`;

const SortIcon = styled.svg`
  width: ${({ theme }) => theme.sizes.icon.xs};
  height: ${({ theme }) => theme.sizes.icon.xs};
`;

const EmptyRow = styled.div`
  ${flexCenter};
  height: ${({ theme }) => theme.sizes.component.emptyStateHeight};
  width: 100%;
`;

const EmptyCell = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SpacerDiv = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => `${$height}px`};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.background.loadingOverlay};
  backdrop-filter: blur(${({ theme }) => theme.sizes.component.overlayBlur});
  ${flexCenter};
  z-index: ${({ theme }) => theme.zIndices.sticky};
`;
