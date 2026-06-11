import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { useTheme } from "@emotion/react";
import {
  applyAnimation,
  visuallyHidden,
  floatingSurface,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";
import { Overlay } from "./Overlay";
import { IconButton } from "../elements/IconButton";
import { Text } from "../typography/Text";
import {
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
} from "../layout";
import { contentShow } from "../../styles";

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
        >
          {(title || !hideCloseButton) && (
            <SectionHeader>
              <SectionTitleGroup>
                {title ? (
                  <Dialog.Title asChild>
                    {typeof title === "string" ? (
                      <Text variant="h2" weight="bold" as="h2">
                        {title}
                      </Text>
                    ) : (
                      <div>{title}</div>
                    )}
                  </Dialog.Title>
                ) : (
                  <Dialog.Title asChild>
                    <VisuallyHidden>
                      {t("ui.component.modal.title")}
                    </VisuallyHidden>
                  </Dialog.Title>
                )}

                {description ? (
                  <Dialog.Description asChild>
                    {/* 💡 설명 부분도 Text 컴포넌트로 교체 */}
                    {typeof description === "string" ? (
                      <Text variant="body2" color="secondary" as="p">
                        {description}
                      </Text>
                    ) : (
                      <div>{description}</div>
                    )}
                  </Dialog.Description>
                ) : (
                  <Dialog.Description asChild>
                    <VisuallyHidden>
                      {t("ui.component.modal.description")}
                    </VisuallyHidden>
                  </Dialog.Description>
                )}
              </SectionTitleGroup>

              {!hideCloseButton && (
                <Dialog.Close asChild>
                  <IconButton
                    variant="ghost"
                    color="default"
                    icon={<X />}
                    aria-label={t("ui.component.modal.close")}
                  />
                </Dialog.Close>
              )}
            </SectionHeader>
          )}

          <SectionBody>{children}</SectionBody>

          {footer && <SectionFooter>{footer}</SectionFooter>}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// --- Styled Components ---

const Content = styled(Dialog.Content)<{ $maxWidth: string }>`
  ${({ theme }) => floatingSurface(theme)}

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: 100dvh;
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

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;
