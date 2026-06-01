import { keyframes, type Theme } from "@emotion/react";

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const pulse = (theme: Theme) => keyframes`
  0% { box-shadow: 0 0 0 0 ${theme.colors.status.danger}66; }
  70% { box-shadow: 0 0 0 15px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

export const skeletonPulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export const overlayShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const contentShow = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
`;

export const slideUpAndFade = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const accordionSlideDown = keyframes`
  from { height: 0; opacity: 0; }
  to { height: var(--radix-accordion-content-height); opacity: 1; }
`;

export const accordionSlideUp = keyframes`
  from { height: var(--radix-accordion-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
`;

export const slideDownAndFade = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

export const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

export const slideOutLeft = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;
