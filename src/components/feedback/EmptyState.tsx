import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Inbox } from "lucide-react";
import { flexCenter, flexColumn, squareIconSize } from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";

/**
 * EmptyState가 표시할 아이콘, 제목, 설명, 후속 액션을 정의합니다.
 *
 * 모든 간격은 자체 외부 여백이 아니라 flex gap으로 제어되며, 컨테이너는 표준 div
 * 속성을 상속합니다.
 */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * 데이터가 없거나 결과가 비어 있는 상태를 일관되게 표현하는 feedback 컴포넌트입니다.
 *
 * 기본 문구는 i18n dictionary를 사용하며, 커스텀 action 슬롯을 통해 다음 행동을
 * 연결할 수 있습니다.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, ...props }, ref) => {
    const { t } = useUiConfig();

    return (
      <Container ref={ref} {...props}>
        <IconWrapper>{icon || <Inbox />}</IconWrapper>
        <ContentWrapper>
          <Title role="heading" aria-level={4}>
            {title || t("common.noData")}
          </Title>
          {description && <Description>{description}</Description>}
        </ContentWrapper>
        {action && <ActionWrapper>{action}</ActionWrapper>}
      </Container>
    );
  },
);

EmptyState.displayName = "EmptyState";

const Container = styled.div`
  ${flexColumn}
  ${flexCenter}
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  min-height: ${({ theme }) => theme.sizes.component.emptyStateHeight};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: transparent;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text.disabled};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "xl")}
  }
`;

const ContentWrapper = styled.div`
  ${flexColumn}
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: ${({ theme }) => theme.sizes.component.modalAlertWidth};
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.disabled};
`;

const ActionWrapper = styled.div`
  ${flexCenter}
`;
