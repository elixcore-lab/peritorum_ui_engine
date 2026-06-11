import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { type AlertVariant } from "../overlays/AlertModal";
import { flexCenter, squareIconSize } from "../../styles/mixins";

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
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
      <CalloutContainer ref={ref} $variant={variant} {...props}>
        <IconWrapper $variant={variant}>
          {icon || <IconComponent />}
        </IconWrapper>
        <ContentWrapper>
          {title && <CalloutTitle>{title}</CalloutTitle>}
          <CalloutBody>{children}</CalloutBody>
        </ContentWrapper>
      </CalloutContainer>
    );
  },
);
Callout.displayName = "Callout";

const CalloutContainer = styled.div<{ $variant: AlertVariant }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $variant }) => theme.colors.statusBg[$variant]};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
`;

const IconWrapper = styled.div<{ $variant: AlertVariant }>`
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
`;

const CalloutTitle = styled.h5`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CalloutBody = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;
