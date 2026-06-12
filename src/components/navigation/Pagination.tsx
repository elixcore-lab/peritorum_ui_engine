import React, { forwardRef, useMemo } from "react";
import styled from "@emotion/styled";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  disabledState,
  focusRing,
  resetButton,
  squareIconSize,
  transitionBase,
} from "../../styles";
import { clamp } from "../../utils";
import { useUiConfig } from "../../ConfigProvider";

type PaginationItem = number | "ellipsis";

/**
 * Pagination 컴포넌트가 지원하는 페이지 상태와 표시 범위를 정의합니다.
 */
export interface PaginationProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "children" | "style"> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  showBoundaryControls?: boolean;
}

const createPaginationItems = ({
  page,
  totalPages,
  siblingCount,
  boundaryCount,
}: Required<Pick<
  PaginationProps,
  "boundaryCount" | "page" | "siblingCount" | "totalPages"
>>): PaginationItem[] => {
  const startPages = Array.from(
    { length: Math.min(boundaryCount, totalPages) },
    (_, index) => index + 1,
  );
  const endPages = Array.from(
    { length: Math.min(boundaryCount, totalPages) },
    (_, index) => totalPages - index,
  )
    .reverse()
    .filter((item) => !startPages.includes(item));

  const siblingStart = Math.max(
    Math.min(
      page - siblingCount,
      totalPages - boundaryCount - siblingCount * 2,
    ),
    boundaryCount + 1,
  );
  const siblingEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 1),
    endPages[0] ? endPages[0] - 1 : totalPages,
  );

  const items: PaginationItem[] = [...startPages];

  if (siblingStart > boundaryCount + 1) {
    items.push("ellipsis");
  }

  for (let item = siblingStart; item <= siblingEnd; item += 1) {
    if (!items.includes(item)) items.push(item);
  }

  if (endPages.length && siblingEnd < endPages[0] - 1) {
    items.push("ellipsis");
  }

  endPages.forEach((item) => {
    if (!items.includes(item)) items.push(item);
  });

  return items;
};

/**
 * 긴 목록이나 표의 페이지 이동을 제공하는 navigation 컴포넌트입니다.
 *
 * 현재 페이지, 전체 페이지, sibling/boundary 범위를 기반으로 접근성 있는 페이지
 * 버튼과 이전/다음 컨트롤을 렌더링합니다.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      disabled = false,
      siblingCount = 1,
      boundaryCount = 1,
      showBoundaryControls = true,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const safeTotalPages = Math.max(totalPages, 1);
    const safePage = clamp(page, 1, safeTotalPages);

    const items = useMemo(
      () =>
        createPaginationItems({
          page: safePage,
          totalPages: safeTotalPages,
          siblingCount,
          boundaryCount,
        }),
      [boundaryCount, safePage, safeTotalPages, siblingCount],
    );

    const handlePageChange = (nextPage: number) => {
      if (disabled) return;
      const resolvedPage = clamp(nextPage, 1, safeTotalPages);
      if (resolvedPage !== safePage) onPageChange(resolvedPage);
    };

    return (
      <PaginationNav
        ref={ref}
        aria-label={ariaLabel || t("ui.component.pagination.label")}
        {...props}
      >
        <PaginationList>
          {showBoundaryControls && (
            <PaginationControl
              type="button"
              disabled={disabled || safePage === 1}
              aria-label={t("ui.component.pagination.first")}
              onClick={() => handlePageChange(1)}
            >
              <ChevronsLeft />
            </PaginationControl>
          )}
          <PaginationControl
            type="button"
            disabled={disabled || safePage === 1}
            aria-label={t("ui.component.pagination.prev")}
            onClick={() => handlePageChange(safePage - 1)}
          >
            <ChevronLeft />
          </PaginationControl>

          {items.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationEllipsis
                key={`ellipsis-${index}`}
                aria-label={t("ui.component.pagination.ellipsis")}
              >
                ...
              </PaginationEllipsis>
            ) : (
              <PaginationPageButton
                key={item}
                type="button"
                disabled={disabled}
                $active={item === safePage}
                aria-current={item === safePage ? "page" : undefined}
                aria-label={t("ui.component.pagination.page", { page: item })}
                onClick={() => handlePageChange(item)}
              >
                {item}
              </PaginationPageButton>
            ),
          )}

          <PaginationControl
            type="button"
            disabled={disabled || safePage === safeTotalPages}
            aria-label={t("ui.component.pagination.next")}
            onClick={() => handlePageChange(safePage + 1)}
          >
            <ChevronRight />
          </PaginationControl>
          {showBoundaryControls && (
            <PaginationControl
              type="button"
              disabled={disabled || safePage === safeTotalPages}
              aria-label={t("ui.component.pagination.last")}
              onClick={() => handlePageChange(safeTotalPages)}
            >
              <ChevronsRight />
            </PaginationControl>
          )}
        </PaginationList>
      </PaginationNav>
    );
  },
);

Pagination.displayName = "Pagination";

const PaginationNav = styled.nav`
  display: inline-flex;
`;

const PaginationList = styled.div`
  all: unset;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const pageButtonFilter = {
  shouldForwardProp: (prop: string) => prop !== "$active",
};

const PaginationButtonBase = styled.button`
  ${resetButton}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ theme }) => theme.sizes.control.sm};
  height: ${({ theme }) => theme.sizes.control.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  ${({ theme }) => transitionBase(theme)}

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
  }

  ${({ theme }) => disabledState(theme)}
`;

const PaginationPageButton = styled(PaginationButtonBase, pageButtonFilter)<{
  $active: boolean;
}>`
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.statusBg.info : theme.colors.utility.transparent};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text.primary : theme.colors.text.secondary};
`;

const PaginationControl = styled(PaginationButtonBase)`
  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
  }
`;

const PaginationEllipsis = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ theme }) => theme.sizes.control.sm};
  height: ${({ theme }) => theme.sizes.control.sm};
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
