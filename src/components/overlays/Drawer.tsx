import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { keyframes, useTheme } from "@emotion/react";
import { X } from "lucide-react";
import { Overlay } from "./Overlay";
import { useUiConfig } from "../../ConfigProvider";
import { applyAnimation, flexCenter, visuallyHidden } from "../../styles";

export interface DrawerProps {
  children: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  title?: React.ReactNode;
  width?: string;
}

export const Drawer = ({
  children,
  description,
  footer,
  isOpen,
  onOpenChange,
  side = "right",
  title,
  width,
}: DrawerProps) => {
  const theme = useTheme();
  const { t } = useUiConfig();
  const resolvedWidth = width ?? "360px";

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Overlay zIndex={theme.zIndices.modal} />
        </Dialog.Overlay>
        <Content $side={side} $width={resolvedWidth}>
          <Header>
            <HeaderTitles>
              {title ? (
                <Dialog.Title asChild>
                  <TitleText>{title}</TitleText>
                </Dialog.Title>
              ) : (
                <Dialog.Title asChild>
                  <VisuallyHidden>
                    {t("ui.component.drawer.title")}
                  </VisuallyHidden>
                </Dialog.Title>
              )}
              {description ? (
                <Dialog.Description asChild>
                  <DescriptionText>{description}</DescriptionText>
                </Dialog.Description>
              ) : null}
            </HeaderTitles>
            <Dialog.Close asChild>
              <CloseButton aria-label={t("ui.component.drawer.close")}>
                <CloseIcon />
              </CloseButton>
            </Dialog.Close>
          </Header>
          <Body>{children}</Body>
          {footer ? <Footer>{footer}</Footer> : null}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const slideFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideFromLeft = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Content = styled(Dialog.Content)<{
  $side: "left" | "right";
  $width: string;
}>`
  background-color: ${({ theme }) => theme.colors.background.modal};
  ${({ $side, theme }) => `
    border-${$side === "right" ? "left" : "right"}: ${theme.sizes.component.dividerThin} solid ${theme.colors.border.divider};
  `}
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: min(${({ $width }) => $width}, 92vw);
  outline: none;
  position: fixed;
  top: 0;
  ${({ $side }) => `${$side}: 0;`}
  width: ${({ $width }) => $width};
  z-index: ${({ theme }) => theme.zIndices.modal};
  ${({ theme, $side }) =>
    applyAnimation(
      theme,
      $side === "right" ? slideFromRight : slideFromLeft,
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}
`;

const Header = styled.div`
  align-items: flex-start;
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const HeaderTitles = styled.div`
  display: grid;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`;

const TitleText = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0;
`;

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
`;

const Body = styled.div`
  background-color: ${({ theme }) => theme.colors.background.page};
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Footer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.surface};
  border-top: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const CloseButton = styled.button`
  all: unset;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  ${flexCenter}

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CloseIcon = styled(X)`
  height: ${({ theme }) => theme.sizes.icon.md};
  width: ${({ theme }) => theme.sizes.icon.md};
`;

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;
