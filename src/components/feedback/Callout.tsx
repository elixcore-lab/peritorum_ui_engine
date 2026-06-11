import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { type AlertVariant } from "../overlays/AlertModal";
import { flexCenter, squareIconSize } from "../../styles/mixins";

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

export const Callout = forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = "info", title, icon, children, ...props }, ref) => {
    const IconComponent = ICONS[variant];

    return (
      <CalloutContainer
        ref={ref}
        $variant={variant}
        role="region"
        aria-label={typeof title === "string" ? title : `${variant} callout`}
        {...props}
      >
        <IconWrapper $variant={variant}>
          {icon || <IconComponent />}
        </IconWrapper>
        <ContentWrapper>
          {title && <CalloutTitle>{title}</CalloutTitle>}
          {/* children이 없을 때 빈 div가 렌더링되지 않도록 방어 */}
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
  min-width: 0;
`;

const CalloutTitle = styled.div`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CalloutBody = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  & > *:first-of-type {
    margin-top: 0;
  }
  & > *:last-of-type {
    margin-bottom: 0;
  }
`;
