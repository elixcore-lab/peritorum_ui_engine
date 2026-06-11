import { keyframes, type Theme } from "@emotion/react";

// ==========================================
// 1. Basic Transitions (기본 트랜지션)
// ==========================================
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const scaleIn = keyframes`
  /* 💡 UX 최적화: 0.5 -> 0.95로 변경하여 B2B 환경에 맞는 부드러운 스케일링 제공 */
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ==========================================
// 2. Feedback & Status (상태 및 피드백)
// ==========================================
export const skeletonPulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export const pulse = (theme: Theme) => keyframes`
  0% { box-shadow: 0 0 0 0 ${theme.colors.status.danger}66; }
  70% { box-shadow: 0 0 0 ${theme.spacing.md} transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
`;

export const shine = keyframes`
  0% {
    left: -150%;
  }
  20% {
    left: 150%;
  }
  100% {
    left: 150%;
  }
`;

// ==========================================
// 3. Overlay & Directional Moves (오버레이 및 방향 이동)
// ==========================================
export const overlayShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const contentShow = keyframes`
  /* 모달 등 화면 정중앙에 위치한 요소가 스르륵 뜰 때 사용 */
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const slideUpAndFade = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideDownAndFade = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const accordionSlideDown = keyframes`
  /* Radix UI 등과 호환되는 CSS Variable 기반 아코디언 애니메이션 */
  from { height: 0; opacity: 0; }
  to { height: var(--radix-accordion-content-height); opacity: 1; }
`;

export const accordionSlideUp = keyframes`
  from { height: var(--radix-accordion-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
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

// ==========================================
// 4. Special Effects (랜딩 페이지 등 특수 시각 효과)
// ==========================================
export const pulseGlow = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.1); opacity: 0.5; }
`;

export const floatAnimation = keyframes`
  /* 3D 느낌을 주는 부유 애니메이션 */
  0% { transform: translateY(0px) rotateX(2deg); }
  50% { transform: translateY(-12px) rotateX(4deg); }
  100% { transform: translateY(0px) rotateX(2deg); }
`;

export const rotatingDataRing = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const dataStreamWave = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: -200% 0; }
`;

export const contentPopIn = keyframes`
  0% { opacity: 0; transform: scale(0.8) translateY(10px); }
  20% { opacity: 1; transform: scale(1) translateY(0); }
  80% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.8) translateY(-10px); }
`;
