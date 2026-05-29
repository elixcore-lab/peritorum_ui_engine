import styled from "@emotion/styled";

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

const Panel = styled.section`
  background: ${({ theme }) => theme.colors.background.surface};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.base};
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
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

const InlineActions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export { DataRow, InlineActions, PageHeader, PageStack, Panel, ResponsiveGrid };
