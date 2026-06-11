import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { type AlertVariant } from "../overlays/AlertModal";
import { flexCenter, squareIconSize } from "../../styles/mixins";

/**
 * Callout의 상태 variant, 제목, 커스텀 아이콘 슬롯을 정의합니다.
 *
 * div 표준 속성을 상속하며, title은 aria-label로도 활용될 수 있습니다.
 */
export interface CalloutProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}

const ICONS = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
};

/**
 * 정보, 성공, 경고, 오류 메시지를 본문 흐름 안에 표시하는 inline feedback 컴포넌트입니다.
 *
 * 상태 색상은 theme status token을 사용하고, 내부 spacing은 flex gap으로만 제어합니다.
 */
export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = "info", title, icon, children, ...props }, ref) => {
    const IconComponent = ICONS[variant];

    return (
      <CalloutContainer
        ref={ref}
        $variant={variant}
        role="region"
        aria-label={typeof title === "string" ? title : undefined}
        {...props}
      >
        <IconWrapper $variant={variant}>
          {icon || <IconComponent />}
        </IconWrapper>
        <ContentWrapper>
          {title && <CalloutTitle>{title}</CalloutTitle>}
          {children && <CalloutBody>{children}</CalloutBody>}
        </ContentWrapper>
      </CalloutContainer>
    );
  },
);

Callout.displayName = "Callout";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) => !["$variant"].includes(prop),
};

const CalloutContainer = styled("div", filterProps)<{ $variant: AlertVariant }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $variant }) => theme.colors.statusBg[$variant]};

  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme, $variant }) => theme.colors.status[$variant]}40;
`;

const IconWrapper = styled("div", filterProps)<{ $variant: AlertVariant }>`
  ${flexCenter}
  color: ${({ theme, $variant }) => theme.colors.status[$variant]};
  flex-shrink: 0;

  & > svg {
    ${({ theme }) => squareIconSize(theme, "md")}
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["2xs"]};

  flex: 1;
  min-width: ${({ theme }) => theme.spacing.none};
`;

const CalloutTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CalloutBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
