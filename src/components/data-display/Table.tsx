import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { customScrollbar, textEllipsis, transitionBase } from "../../styles";
import { useUiConfig } from "../../ConfigProvider";

/**
 * Table root가 지원하는 표준 table 속성과 밀도 옵션을 정의합니다.
 */
export interface TableProps
  extends Omit<React.ComponentPropsWithoutRef<"table">, "style"> {
  fullWidth?: boolean;
}

/**
 * TableHeader가 지원하는 표준 thead 속성을 정의합니다.
 */
export interface TableHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<"thead">, "style"> {}

/**
 * TableBody가 지원하는 표준 tbody 속성을 정의합니다.
 */
export interface TableBodyProps
  extends Omit<React.ComponentPropsWithoutRef<"tbody">, "style"> {}

/**
 * TableRow가 지원하는 표준 tr 속성과 hover 상태 옵션을 정의합니다.
 */
export interface TableRowProps
  extends Omit<React.ComponentPropsWithoutRef<"tr">, "style"> {
  interactive?: boolean;
}

/**
 * TableHeadCell이 지원하는 표준 th 속성과 정렬 옵션을 정의합니다.
 */
export interface TableHeadCellProps
  extends Omit<React.ComponentPropsWithoutRef<"th">, "align" | "style"> {
  align?: React.CSSProperties["textAlign"];
  ellipsis?: boolean;
}

/**
 * TableCell이 지원하는 표준 td 속성과 정렬 옵션을 정의합니다.
 */
export interface TableCellProps
  extends Omit<React.ComponentPropsWithoutRef<"td">, "align" | "style"> {
  align?: React.CSSProperties["textAlign"];
  ellipsis?: boolean;
}

/**
 * TableCaption이 지원하는 표준 caption 속성을 정의합니다.
 */
export interface TableCaptionProps
  extends Omit<React.ComponentPropsWithoutRef<"caption">, "style"> {}

/**
 * TableEmpty가 지원하는 빈 상태 셀 옵션을 정의합니다.
 */
export interface TableEmptyProps
  extends Omit<React.ComponentPropsWithoutRef<"td">, "children" | "style"> {
  children?: React.ReactNode;
}

const rootFilter = {
  shouldForwardProp: (prop: string) => prop !== "$fullWidth",
};

const TableRoot = forwardRef<HTMLTableElement, TableProps>(
  ({ fullWidth = true, children, ...props }, ref) => {
    return (
      <StyledTable ref={ref} $fullWidth={fullWidth} {...props}>
        {children}
      </StyledTable>
    );
  },
);
TableRoot.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledTableHeader ref={ref} {...props}>
        {children}
      </StyledTableHeader>
    );
  },
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledTableBody ref={ref} {...props}>
        {children}
      </StyledTableBody>
    );
  },
);
TableBody.displayName = "TableBody";

const rowFilter = {
  shouldForwardProp: (prop: string) => prop !== "$interactive",
};

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ interactive = false, children, ...props }, ref) => {
    return (
      <StyledTableRow ref={ref} $interactive={interactive} {...props}>
        {children}
      </StyledTableRow>
    );
  },
);
TableRow.displayName = "TableRow";

const cellFilter = {
  shouldForwardProp: (prop: string) =>
    !["$align", "$ellipsis"].includes(prop),
};

const TableHeadCell = forwardRef<HTMLTableCellElement, TableHeadCellProps>(
  ({ align = "left", ellipsis = false, children, ...props }, ref) => {
    return (
      <StyledTableHeadCell
        ref={ref}
        $align={align}
        $ellipsis={ellipsis}
        {...props}
      >
        {children}
      </StyledTableHeadCell>
    );
  },
);
TableHeadCell.displayName = "TableHeadCell";

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = "left", ellipsis = false, children, ...props }, ref) => {
    return (
      <StyledTableCell
        ref={ref}
        $align={align}
        $ellipsis={ellipsis}
        {...props}
      >
        {children}
      </StyledTableCell>
    );
  },
);
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ children, ...props }, ref) => {
  return (
    <StyledTableCaption ref={ref} {...props}>
      {children}
    </StyledTableCaption>
  );
});
TableCaption.displayName = "TableCaption";

const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  ({ children, colSpan = 1, ...props }, ref) => {
    const { t } = useUiConfig();

    return (
      <StyledTableEmptyCell ref={ref} colSpan={colSpan} {...props}>
        {children || t("common.noData")}
      </StyledTableEmptyCell>
    );
  },
);
TableEmpty.displayName = "TableEmpty";

/**
 * 일반 데이터 표를 구성하는 semantic compound Table 컴포넌트입니다.
 *
 * VirtualScrollTable이 필요하지 않은 CRUD/목록 화면에서 header, body, row, cell을
 * 조합해 사용합니다.
 */
export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeadCell: TableHeadCell,
  Cell: TableCell,
  Caption: TableCaption,
  Empty: TableEmpty,
});

const StyledTable = styled("table", rootFilter)<{ $fullWidth: boolean }>`
  border-collapse: collapse;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : undefined)};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.surface};
`;

const StyledTableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background.input};
`;

const StyledTableBody = styled.tbody`
  ${({ theme }) => customScrollbar(theme)}
`;

const StyledTableRow = styled("tr", rowFilter)<{ $interactive: boolean }>`
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};

  ${({ theme }) => transitionBase(theme)}

  &:hover {
    background-color: ${({ theme, $interactive }) =>
      $interactive
        ? theme.colors.background.hover
        : theme.colors.utility.transparent};
  }
`;

const sharedCellStyles = ({
  theme,
  $align,
  $ellipsis,
}: {
  theme: import("@emotion/react").Theme;
  $align: React.CSSProperties["textAlign"];
  $ellipsis: boolean;
}) => `
  padding: ${theme.spacing.sm} ${theme.spacing.base};
  text-align: ${$align};
  vertical-align: middle;
  font-size: ${theme.fontSizes.sm};
  ${$ellipsis ? textEllipsis.styles : ""}
`;

const StyledTableHeadCell = styled("th", cellFilter)<{
  $align: React.CSSProperties["textAlign"];
  $ellipsis: boolean;
}>`
  ${({ theme, $align, $ellipsis }) =>
    sharedCellStyles({ theme, $align, $ellipsis })}
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const StyledTableCell = styled("td", cellFilter)<{
  $align: React.CSSProperties["textAlign"];
  $ellipsis: boolean;
}>`
  ${({ theme, $align, $ellipsis }) =>
    sharedCellStyles({ theme, $align, $ellipsis })}
`;

const StyledTableCaption = styled.caption`
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const StyledTableEmptyCell = styled.td`
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`;
