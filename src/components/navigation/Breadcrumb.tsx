import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { css, type Theme } from "@emotion/react";
import { ChevronRight } from "lucide-react";
import { resetButton, squareIconSize, textEllipsis } from "../../styles";
import { useUiConfig } from "../../ConfigProvider";

/**
 * Breadcrumb item 데이터 모델을 정의합니다.
 *
 * `isCurrent`가 true인 항목은 링크 대신 현재 페이지 텍스트로 렌더링됩니다.
 */
export interface BreadcrumbItemData {
  label: React.ReactNode;
  href?: string;
  isCurrent?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Breadcrumb root가 지원하는 표준 nav 속성과 item 기반 렌더링 옵션을 정의합니다.
 */
export interface BreadcrumbProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "children" | "style"> {
  items?: BreadcrumbItemData[];
  children?: React.ReactNode;
  separator?: React.ReactNode;
}

/**
 * Breadcrumb list slot이 지원하는 표준 ol 속성을 정의합니다.
 */
export interface BreadcrumbListProps
  extends Omit<React.ComponentPropsWithoutRef<"ol">, "style"> {}

/**
 * Breadcrumb item slot이 지원하는 표준 li 속성을 정의합니다.
 */
export interface BreadcrumbItemProps
  extends Omit<React.ComponentPropsWithoutRef<"li">, "style"> {}

/**
 * Breadcrumb link slot이 지원하는 표준 anchor 속성을 정의합니다.
 */
export interface BreadcrumbLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "style"> {}

/**
 * Breadcrumb current slot이 지원하는 표준 span 속성을 정의합니다.
 */
export interface BreadcrumbCurrentProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "style"> {}

/**
 * Breadcrumb separator slot이 지원하는 표준 span 속성을 정의합니다.
 */
export interface BreadcrumbSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "style"> {}

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledBreadcrumbList ref={ref} {...props}>
        {children}
      </StyledBreadcrumbList>
    );
  },
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledBreadcrumbItem ref={ref} {...props}>
        {children}
      </StyledBreadcrumbItem>
    );
  },
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledBreadcrumbLink ref={ref} {...props}>
        {children}
      </StyledBreadcrumbLink>
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbCurrent = forwardRef<
  HTMLSpanElement,
  BreadcrumbCurrentProps
>(({ children, ...props }, ref) => {
  return (
    <StyledBreadcrumbCurrent ref={ref} aria-current="page" {...props}>
      {children}
    </StyledBreadcrumbCurrent>
  );
});
BreadcrumbCurrent.displayName = "BreadcrumbCurrent";

const BreadcrumbSeparator = forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>(({ children, ...props }, ref) => {
  return (
    <StyledBreadcrumbSeparator ref={ref} aria-hidden="true" {...props}>
      {children || <ChevronRight />}
    </StyledBreadcrumbSeparator>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, children, separator, "aria-label": ariaLabel, ...props }, ref) => {
    const { t } = useUiConfig();

    return (
      <StyledBreadcrumbNav
        ref={ref}
        aria-label={ariaLabel || t("ui.component.breadcrumb.label")}
        {...props}
      >
        {children ? (
          children
        ) : (
          <BreadcrumbList>
            {items?.map((item, index) => {
              const isLast = index === items.length - 1;
              const isCurrent = item.isCurrent || isLast;

              return (
                <BreadcrumbItem key={index}>
                  {isCurrent ? (
                    <BreadcrumbCurrent>{item.label}</BreadcrumbCurrent>
                  ) : item.href ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbButton type="button" onClick={item.onClick}>
                      {item.label}
                    </BreadcrumbButton>
                  )}
                  {!isLast && (
                    <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        )}
      </StyledBreadcrumbNav>
    );
  },
);
BreadcrumbRoot.displayName = "Breadcrumb";

/**
 * 현재 위치를 계층형 경로로 표시하는 navigation 컴포넌트입니다.
 *
 * item 배열 기반 API와 compound slot API를 모두 지원합니다.
 */
export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Current: BreadcrumbCurrent,
  Separator: BreadcrumbSeparator,
});

const StyledBreadcrumbNav = styled.nav`
  min-width: ${({ theme }) => theme.spacing.none};
`;

const StyledBreadcrumbList = styled.ol`
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: ${({ theme }) => theme.spacing.none};
  list-style: none;
`;

const StyledBreadcrumbItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: ${({ theme }) => theme.spacing.none};
`;

const crumbTextStyle = ({ theme }: { theme: Theme }) => css`
  min-width: ${theme.spacing.none};
`;

const StyledBreadcrumbLink = styled.a`
  ${crumbTextStyle}
  ${textEllipsis}
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;
`;

const StyledBreadcrumbCurrent = styled.span`
  ${crumbTextStyle}
  ${textEllipsis}
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const BreadcrumbButton = styled.button`
  ${resetButton}
  ${crumbTextStyle}
  ${textEllipsis}
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const StyledBreadcrumbSeparator = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.disabled};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xs")}
  }
`;
