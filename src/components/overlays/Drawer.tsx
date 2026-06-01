import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { X } from "lucide-react";
import { Overlay } from "./Overlay";
import { IconButton } from "../elements/IconButton";
import { useUiConfig } from "../../ConfigProvider";
import { slideInRight, slideInLeft } from "../../styles/animation";
import { applyAnimation, visuallyHidden } from "../../styles";
import {
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
} from "../layout";

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
                    {t("ui.component.drawer.title")}
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
                    {t("ui.component.drawer.description")}
                  </VisuallyHidden>
                </Dialog.Description>
              )}
            </SectionTitleGroup>

            <Dialog.Close asChild>
              <IconButton
                variant="ghost"
                icon={<X />}
                aria-label={t("ui.component.drawer.close")}
              />
            </Dialog.Close>
          </SectionHeader>

          <SectionBody>{children}</SectionBody>

          {footer ? <SectionFooter>{footer}</SectionFooter> : null}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

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
  max-width: min(${({ $width }) => $width}, 92vw);
  outline: none;
  position: fixed;
  top: 0;
  bottom: 0;
  ${({ $side }) => `${$side}: 0;`}
  width: ${({ $width }) => $width};
  z-index: ${({ theme }) => theme.zIndices.modal};
  ${({ theme, $side }) =>
    applyAnimation(
      theme,
      $side === "right" ? slideInRight : slideInLeft,
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}
`;

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;
