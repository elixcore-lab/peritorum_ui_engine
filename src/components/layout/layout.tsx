import styled from "@emotion/styled";
import { customScrollbar, Spacing } from "../../styles";
import { css } from "@emotion/react";
import { ComponentProps, forwardRef } from "react";

export interface StackProp {
  $direction?: React.CSSProperties["flexDirection"];
  $align?: React.CSSProperties["alignItems"];
  $justify?: React.CSSProperties["justifyContent"];
  $spacing?: Spacing;
  $wrap?: React.CSSProperties["flexWrap"];
  $padding?: Spacing | string;
  $backgroundColor?: string;
  $width?: string;
  $maxWidth?: string;
  $minWidth?: string;

  $height?: string;
  $maxHeight?: string;
  $minHeight?: string;
  $flex?: string;
}

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
    return theme.spacing[$spacing as Spacing] || $spacing;
  }};

  flex: ${({ $flex }) => $flex};
  padding: ${({ theme, $padding }) => {
    if (!$padding) return undefined;
    return theme.spacing[$padding as Spacing] || $padding;
  }};

  width: ${({ $width, $flex }) => ($flex ? undefined : $width || "100%")};
  max-width: ${({ $maxWidth }) => $maxWidth};
  min-width: ${({ $minWidth, $flex }) => ($flex ? $minWidth || 0 : $minWidth)};

  height: ${({ $height }) => $height};
  max-height: ${({ $maxHeight }) => $maxHeight};
  min-height: ${({ $minHeight }) => $minHeight};
`;

export type StackProps = ComponentProps<typeof Stack>;

const ResponsiveGrid = styled.div<{
  $spacing?: Spacing;
  $columns?: { base: number; tablet?: number; desktop?: number };
  $minItemWidth?: string;
  $height?: string;
  $padding?: Spacing;
}>`
  display: grid;
  gap: ${({ theme, $spacing }) =>
    $spacing ? theme.spacing[$spacing] : theme.spacing.md};
  width: 100%;
  height: ${({ $height }) => $height || "100%"};
  padding: ${({ theme, $padding }) =>
    $padding ? theme.spacing[$padding] : undefined};

  ${({ theme, $columns, $minItemWidth }) => {
    if ($columns) {
      return css`
        grid-template-columns: repeat(${$columns.base}, 1fr);
        ${$columns.tablet &&
        css`
          @media (min-width: 768px) {
            grid-template-columns: repeat(${$columns.tablet}, 1fr);
          }
        `}

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
        minmax(${$minItemWidth || "240px"}, 1fr)
      );
    `;
  }}
`;

// const InlineActions = (props: StackProps) => {
//   return <Stack $direction="row" $align="center" {...props} />;
// };
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

const SectionTitleGroup = styled(Stack)`
  flex: ${({ $flex }) => ($flex === undefined ? 1 : $flex)};
  min-width: 0;
`;

export interface SectionBodyProps extends StackProps {
  $overflow?: React.CSSProperties["overflow"];
}

const StyledSectionBody = styled(Stack)<SectionBodyProps>`
  overflow: ${({ $overflow }) => $overflow};

  ${({ theme, $overflow }) =>
    $overflow === "hidden" ? undefined : customScrollbar(theme)}
`;

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
