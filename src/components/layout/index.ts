import styled from "@emotion/styled";
import { customScrollbar, textEllipsis } from "../../styles";

const PageStack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PageHeader = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  h1,
  p {
    margin: 0;
  }
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.6;
  }
`;

const Panel = styled.section<{ $noPadding?: boolean }>`
  background: ${({ theme }) => theme.colors.background.surface};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.base};
  display: grid;
  gap: ${({ theme, $noPadding }) => ($noPadding ? "0" : theme.spacing.md)};
  padding: ${({ theme, $noPadding }) => ($noPadding ? "0" : theme.spacing.lg)};
  overflow: hidden;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const DataRow = styled.div`
  align-items: center;
  border-top: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: minmax(0, 1fr) auto;
  padding: ${({ theme }) => theme.spacing.md} 0 0;

  ${({ theme }) => theme.media.mobile} {
    align-items: stretch;
    grid-template-columns: 1fr;
  }
`;

const InlineActions = styled.div<{
  $justify?: React.CSSProperties["justifyContent"];
}>`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
`;

const SectionHeader = styled.div<{ $noBorder?: boolean }>`
  align-items: flex-start;
  border-bottom: ${({ theme, $noBorder }) =>
    $noBorder
      ? "none"
      : `${theme.sizes.component.dividerThin} solid ${theme.colors.border.divider}`};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitleGroup = styled.div`
  display: grid;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;

  h2,
  h3 {
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    margin: 0;
    ${textEllipsis}
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin: 0;
    ${textEllipsis}
  }
`;

const SectionBody = styled.div<{ $transparent?: boolean }>`
  background-color: ${({ theme, $transparent }) =>
    $transparent ? "transparent" : theme.colors.background.page};
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  ${({ theme }) => customScrollbar(theme)}
`;

const SectionFooter = styled.div<{
  $noBorder?: boolean;
  $align?: "flex-start" | "center" | "flex-end";
}>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.surface};
  border-top: ${({ theme, $noBorder }) =>
    $noBorder
      ? "none"
      : `${theme.sizes.component.dividerThin} solid ${theme.colors.border.divider}`};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: ${({ $align }) => $align || "flex-end"};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

export {
  DataRow,
  InlineActions,
  PageHeader,
  PageStack,
  Panel,
  ResponsiveGrid,
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
};
