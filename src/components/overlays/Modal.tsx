import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { useTheme } from "@emotion/react";
import {
  applyAnimation,
  applyTransition,
  flexCenter,
  visuallyHidden,
  contentShow,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { Overlay } from "./Overlay";

// --- Types ---
export interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  hideCloseButton?: boolean;
  preventOutsideClose?: boolean;
}

// --- Component ---
export const Modal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width,
  hideCloseButton = false,
  preventOutsideClose = false,
}: ModalProps) => {
  const theme = useTheme();
  const { t } = useUiConfig();
  const maxWidth = width || theme.sizes.component.modalDefaultWidth;

  const handleInteractOutside = (e: Event) => {
    if (preventOutsideClose) {
      e.preventDefault();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Overlay zIndex={theme.zIndices.modal} />
        </Dialog.Overlay>

        <Content
          $maxWidth={maxWidth}
          onPointerDownOutside={handleInteractOutside}
          onEscapeKeyDown={handleInteractOutside}
          aria-describedby={undefined}
        >
          {(title || !hideCloseButton) && (
            <Header>
              <HeaderTitles>
                {title ? (
                  <Dialog.Title asChild>
                    <TitleText>{title}</TitleText>
                  </Dialog.Title>
                ) : (
                  <Dialog.Title asChild>
                    <VisuallyHidden>
                      {t("ui.component.modal.title")}
                    </VisuallyHidden>
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description asChild>
                    <DescriptionText>{description}</DescriptionText>
                  </Dialog.Description>
                )}
              </HeaderTitles>

              {!hideCloseButton && (
                <Dialog.Close asChild>
                  <CloseButton aria-label={t("ui.component.modal.close")}>
                    <CloseIcon />
                  </CloseButton>
                </Dialog.Close>
              )}
            </Header>
          )}

          <Body>{children}</Body>

          {footer && <Footer>{footer}</Footer>}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// --- Styled Components ---

const Content = styled(Dialog.Content)<{ $maxWidth: string }>`
  background-color: ${({ theme }) => theme.colors.background.modal};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndices.modal};
  outline: none;

  ${({ theme }) =>
    applyAnimation(
      theme,
      contentShow,
      theme.transitions.duration.fast,
      theme.transitions.function.spring,
    )}
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
`;

const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
`;

const TitleText = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DescriptionText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.page};
  flex: 1;
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.surface};
`;

const CloseButton = styled.button`
  all: unset;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  padding: ${({ theme }) => theme.spacing.xs};
  ${flexCenter}

  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color, color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CloseIcon = styled(X)`
  width: ${({ theme }) => theme.sizes.icon.md};
  height: ${({ theme }) => theme.sizes.icon.md};
`;

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;
