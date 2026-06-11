import styled from "@emotion/styled";
import { customScrollbar, Spacing } from "../../styles";
import { css } from "@emotion/react";
import { ComponentProps, forwardRef } from "react";

/**
 * Stack 기반 레이아웃 컴포넌트가 공유하는 spacing, alignment, sizing 토큰입니다.
 *
 * `$spacing`과 `$padding`은 theme spacing 토큰을 우선 사용하며, 컴포넌트 간 간격은
 * 개별 child 여백 속성이 아니라 Stack의 gap으로 제어합니다.
 */
export interface StackProp {
  $direction?: React.CSSProperties["flexDirection"];
  $align?: React.CSSProperties["alignItems"];
  $justify?: React.CSSProperties["justifyContent"];
  $spacing?: Spacing;
  $wrap?: React.CSSProperties["flexWrap"];
  $padding?: Spacing;
  $backgroundColor?: string;
  $width?: string;
  $maxWidth?: string;
  $minWidth?: string;

  $height?: string;
  $maxHeight?: string;
  $minHeight?: string;
  $flex?: string;
}

/**
 * 수직/수평 흐름과 gap을 제어하는 가장 기본적인 레이아웃 primitive입니다.
 *
 * 모든 하위 컴포넌트는 자체 외부 여백 대신 Stack의 `$spacing`과 `$padding`을 통해
 * 배치되는 것을 기본 컨벤션으로 삼습니다.
 */
const Stack = styled.div<StackProp>`
  display: flex;
  position: relative;

  background-color: ${({ $backgroundColor }) => $backgroundColor};
  flex-direction: ${({ $direction }) => $direction || "column"};
  align-items: ${({ $align }) => $align};
  justify-content: ${({ $justify }) => $justify};
  flex-wrap: ${({ $wrap }) => $wrap};

  gap: ${({ theme, $spacing }) => {
    if (!$spacing) return theme.spacing.sm;
    return (
      theme.spacing[$spacing as keyof (typeof theme)["spacing"]] || $spacing
    );
  }};

  flex: ${({ $flex }) => $flex};
  padding: ${({ theme, $padding }) => {
    if (!$padding) return undefined;
    return (
      theme.spacing[$padding as keyof (typeof theme)["spacing"]] || $padding
    );
  }};

  width: ${({ $width, $flex }) => ($flex ? undefined : $width || "100%")};
  max-width: ${({ $maxWidth }) => $maxWidth};
  min-width: ${({ $minWidth, $flex }) => ($flex ? $minWidth || 0 : $minWidth)};

  height: ${({ $height }) => $height};
  max-height: ${({ $maxHeight }) => $maxHeight};
  min-height: ${({ $minHeight }) => $minHeight};
`;

export type StackProps = ComponentProps<typeof Stack>;

/**
 * 반응형 카드/패널 목록을 구성하는 grid 레이아웃 primitive입니다.
 *
 * 명시적 column 설정이 없을 때는 theme sizing 토큰을 사용한 auto-fit grid로
 * 동작하며, breakpoint는 theme.media 정의를 재사용합니다.
 */
const ResponsiveGrid = styled.div<{
  $spacing?: Spacing;
  $columns?: { base: number; tablet?: number; desktop?: number };
  $minItemWidth?: string;
  $height?: string;
  $padding?: Spacing;
}>`
  display: grid;

  gap: ${({ theme, $spacing }) =>
    $spacing
      ? theme.spacing[$spacing as keyof (typeof theme)["spacing"]] || $spacing
      : theme.spacing.md};
  width: 100%;
  height: ${({ $height }) => $height || "100%"};
  padding: ${({ theme, $padding }) =>
    $padding
      ? theme.spacing[$padding as keyof (typeof theme)["spacing"]] || $padding
      : undefined};

  ${({ theme, $columns, $minItemWidth }) => {
    if ($columns) {
      const tabletColumns = $columns.tablet ?? $columns.base;

      return css`
        grid-template-columns: repeat(${tabletColumns}, 1fr);

        ${theme.media.mobile} {
          grid-template-columns: repeat(${$columns.base}, 1fr);
        }

        ${$columns.desktop &&
        css`
          ${theme.media.desktop} {
            grid-template-columns: repeat(${$columns.desktop}, 1fr);
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
 * 버튼이나 아이콘처럼 한 줄에 배치되는 액션 묶음을 위한 Stack preset입니다.
 */
const InlineActions = forwardRef<HTMLDivElement, StackProps>(
  ({ $direction = "row", $align = "center", ...props }, ref) => {
    return (
      <Stack ref={ref} $direction={$direction} $align={$align} {...props} />
    );
  },
);
InlineActions.displayName = "InlineActions";

const StyledSection = styled(Stack)`
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $backgroundColor }) =>
    $backgroundColor ? $backgroundColor : theme.colors.background.surface};
  overflow: hidden;
`;

/**
 * surface, border, shadow를 포함한 독립적인 콘텐츠 영역입니다.
 */
const Section = forwardRef<HTMLElement, StackProps>((props, ref) => {
  return (
    <StyledSection
      ref={ref as React.Ref<HTMLDivElement>}
      as="section"
      $spacing={props.$spacing || "none"}
      {...props}
    />
  );
});
Section.displayName = "Section";

const StyledSectionHeader = styled(Stack)``;

/**
 * Section 상단의 제목, 설명, 액션 영역을 정렬하는 header preset입니다.
 */
const SectionHeader = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return (
    <StyledSectionHeader
      ref={ref}
      $spacing={props.$spacing || "md"}
      $align={props.$align || "center"}
      $padding={props.$padding || "md"}
      $direction={props.$direction || "row"}
      {...props}
    />
  );
});
SectionHeader.displayName = "SectionHeader";

/**
 * SectionHeader 내부에서 제목과 설명을 세로로 묶는 title group 영역입니다.
 */
const SectionTitleGroup = styled(Stack)`
  flex: ${({ $flex }) => ($flex === undefined ? 1 : $flex)};
  min-width: ${({ theme }) => theme.spacing.none};
`;

/**
 * SectionBody가 지원하는 overflow 제어 옵션입니다.
 *
 * overflow가 hidden이 아닌 경우 theme 기반 custom scrollbar를 자동 적용합니다.
 */
export interface SectionBodyProps extends StackProps {
  $overflow?: React.CSSProperties["overflow"];
}

const StyledSectionBody = styled(Stack)<SectionBodyProps>`
  overflow: ${({ $overflow }) => $overflow};

  ${({ theme, $overflow }) =>
    $overflow === "hidden" ? undefined : customScrollbar(theme)}
`;

/**
 * Section의 주요 콘텐츠를 담는 scroll-aware body 영역입니다.
 */
const SectionBody = forwardRef<HTMLElement, SectionBodyProps>((props, ref) => {
  return (
    <StyledSectionBody
      ref={ref as React.Ref<HTMLDivElement>}
      $flex="1"
      $padding={props.$padding || "md"}
      $overflow={props.$overflow || "auto"}
      {...props}
    />
  );
});
SectionBody.displayName = "SectionBody";

const StyledSectionFooter = styled(Stack)``;

/**
 * Section 하단 액션을 오른쪽 기준으로 배치하는 footer preset입니다.
 */
const SectionFooter = forwardRef<HTMLElement, StackProps>((props, ref) => {
  return (
    <StyledSectionFooter
      ref={ref as React.Ref<HTMLDivElement>}
      $padding={props.$padding || "md"}
      $align={props.$align ? props.$align : "center"}
      $justify={props.$justify ? props.$justify : "flex-end"}
      {...props}
    />
  );
});
SectionFooter.displayName = "SectionFooter";

/**
 * 남는 공간을 채우기 위한 flex spacer primitive입니다.
 */
const Spacer = styled.div`
  flex: 1;
  align-self: stretch;
`;

export {
  InlineActions,
  Stack,
  Spacer,
  ResponsiveGrid,
  Section,
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
};
