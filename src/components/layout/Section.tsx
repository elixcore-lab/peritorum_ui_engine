import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { customScrollbar } from "../../styles";
import { Stack, type StackProps } from "./Stack";

/**
 * Section root가 지원하는 surface layout props를 정의합니다.
 *
 * Stack의 public layout props를 상속하며, 외부 여백 없이 내부 gap/padding으로만
 * 구조를 구성합니다.
 */
export interface SectionProps extends StackProps<"section"> {}

const StyledSection = styled(Stack)`
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, backgroundColor }) =>
    backgroundColor ? backgroundColor : theme.colors.background.surface};
  overflow: hidden;
`;

const SectionRoot = forwardRef<HTMLElement, SectionProps>(
  ({ gap = "none", as = "section", ...props }, ref) => {
    return <StyledSection ref={ref} as={as} gap={gap} {...props} />;
  },
);

SectionRoot.displayName = "Section";

/**
 * Section header가 지원하는 정렬과 padding layout props를 정의합니다.
 */
export interface SectionHeaderProps extends StackProps<"div"> {}

/**
 * Section 상단의 제목, 설명, 액션 영역을 정렬하는 compound slot입니다.
 */
export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      gap = "md",
      align = "center",
      padding = "md",
      direction = "row",
      ...props
    },
    ref,
  ) => {
    return (
      <Stack
        ref={ref}
        gap={gap}
        align={align}
        padding={padding}
        direction={direction}
        {...props}
      />
    );
  },
);

SectionHeader.displayName = "SectionHeader";

/**
 * SectionTitleGroup이 지원하는 제목/설명 그룹 layout props를 정의합니다.
 */
export interface SectionTitleGroupProps extends StackProps<"div"> {}

const StyledSectionTitleGroup = styled(Stack)`
  min-width: ${({ theme }) => theme.spacing.none};
`;

/**
 * SectionHeader 내부에서 제목과 설명을 세로로 묶는 compound slot입니다.
 */
export const SectionTitleGroup = forwardRef<
  HTMLDivElement,
  SectionTitleGroupProps
>(({ flex = 1, ...props }, ref) => {
  return <StyledSectionTitleGroup ref={ref} flex={flex} {...props} />;
});

SectionTitleGroup.displayName = "SectionTitleGroup";

/**
 * SectionBody가 지원하는 overflow 제어 옵션을 정의합니다.
 */
export interface SectionBodyProps extends StackProps<"div"> {
  overflow?: React.CSSProperties["overflow"];
}

const bodyFilter = {
  shouldForwardProp: (prop: string) => prop !== "$overflow",
};

const StyledSectionBody = styled(Stack, bodyFilter)<{
  $overflow?: React.CSSProperties["overflow"];
}>`
  overflow: ${({ $overflow }) => $overflow};

  ${({ theme, $overflow }) =>
    $overflow === "hidden" ? undefined : customScrollbar(theme)}
`;

/**
 * Section의 주요 콘텐츠를 담는 scroll-aware compound slot입니다.
 */
export const SectionBody = forwardRef<HTMLDivElement, SectionBodyProps>(
  ({ flex = 1, padding = "md", overflow = "auto", ...props }, ref) => {
    return (
      <StyledSectionBody
        ref={ref}
        flex={flex}
        padding={padding}
        $overflow={overflow}
        {...props}
      />
    );
  },
);

SectionBody.displayName = "SectionBody";

/**
 * SectionFooter가 지원하는 정렬과 padding layout props를 정의합니다.
 */
export interface SectionFooterProps extends StackProps<"div"> {}

/**
 * Section 하단 액션을 오른쪽 기준으로 배치하는 compound slot입니다.
 */
export const SectionFooter = forwardRef<HTMLDivElement, SectionFooterProps>(
  (
    { padding = "md", align = "center", justify = "flex-end", ...props },
    ref,
  ) => {
    return (
      <Stack
        ref={ref}
        padding={padding}
        align={align}
        justify={justify}
        {...props}
      />
    );
  },
);

SectionFooter.displayName = "SectionFooter";

/**
 * surface, header, body, footer slot을 포함하는 compound Section API입니다.
 */
export const Section = Object.assign(SectionRoot, {
  Header: SectionHeader,
  TitleGroup: SectionTitleGroup,
  Body: SectionBody,
  Footer: SectionFooter,
});
