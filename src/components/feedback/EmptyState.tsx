import React from "react";
import styled from "@emotion/styled";
import { Inbox } from "lucide-react";
import { useTheme } from "@emotion/react";
import { flexCenter, flexColumn, squareIconSize } from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) => {
  const theme = useTheme();
  const { t } = useUiConfig();

  return (
    <Container {...props}>
      <IconWrapper>{icon || <Inbox />}</IconWrapper>
      <Title>{title || t("common.noData")}</Title>
      {description && <Description>{description}</Description>}
      {action && <ActionWrapper>{action}</ActionWrapper>}
    </Container>
  );
};

const Container = styled.div`
  ${flexColumn}
  ${flexCenter}
  width: 100%;
  min-height: ${({ theme }) => theme.sizes.component.emptyStateHeight};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: transparent;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xl")}
  }
`;

const Title = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Description = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.disabled};
  max-width: 400px;
`;

const ActionWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;
