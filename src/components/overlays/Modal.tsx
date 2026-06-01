import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { useTheme } from "@emotion/react";
import {
  applyAnimation,
  visuallyHidden,
  contentShow,
  floatingSurface,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { Overlay } from "./Overlay";
import { IconButton } from "../elements/IconButton";
import {
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
} from "../layout";

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
        >
          {(title || !hideCloseButton) && (
            <SectionHeader>
              <SectionTitleGroup>
                {title ? (
                  <Dialog.Title asChild>
                    {typeof title === "string" ? (
                      <h2>{title}</h2>
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
                    <p>{description}</p>
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
                    icon={<X />}
                    aria-label={t("ui.component.modal.close")}
                  />
                </Dialog.Close>
              )}
            </SectionHeader>
          )}

          {/* 💡 참고: SectionBody 컴포넌트 내부에 'overflow-y: auto; flex: 1;' 이 적용되어 있어야 
               모달 높이가 100dvh를 넘을 때 정상적으로 내부 스크롤이 발생합니다. */}
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
