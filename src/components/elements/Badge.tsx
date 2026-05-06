import styled from "@emotion/styled";
import type { Theme } from "@emotion/react";
import { applyTransition } from "../../styles";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const getBackgroundColor = (theme: Theme, tone: BadgeTone) => {
  switch (tone) {
    case "success":
      return theme.colors.statusBg.success;
    case "warning":
      return theme.colors.statusBg.warning;
    case "danger":
      return theme.colors.statusBg.danger;
    case "info":
      return theme.colors.statusBg.info;
    case "neutral":
    default:
      return theme.colors.surface.sunken;
  }
};

const getTextColor = (theme: Theme, tone: BadgeTone) => {
  switch (tone) {
    case "success":
      return theme.colors.status.success;
    case "warning":
      return theme.colors.status.warning;
    case "danger":
      return theme.colors.status.danger;
    case "info":
      return theme.colors.status.info;
    case "neutral":
    default:
      return theme.colors.text.secondary;
  }
};

export const Badge = styled.span<{ $tone?: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.sizes.component.badgeMinHeight};

  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.extraBold};

  background-color: ${({ $tone = "neutral", theme }) =>
    getBackgroundColor(theme, $tone)};
  color: ${({ $tone = "neutral", theme }) => getTextColor(theme, $tone)};

  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color, color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}

  white-space: nowrap;
`;

Badge.displayName = "Badge";
