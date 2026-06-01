import { type Theme } from "@emotion/react";

// ==========================================
// 1. 테마 기반 동적 타입 (Theme-dependent)
// ==========================================
export type ControlSize = keyof Theme["sizes"]["control"];
export type IconSize = keyof Theme["sizes"]["icon"];
export type FontSize = keyof Theme["fontSizes"];
export type FontWeight = keyof Theme["fontWeights"];
export type Spacing = keyof Theme["spacing"];

// ==========================================
// 2. 의미론적 타입 (Semantic & Intent)
// ==========================================

export type ColorVariant =
  | "default" // 기본 상태
  | "primary" // 주요/브랜드 컬러
  | "secondary" // 보조 컬러
  | "success" // 긍정적 상태 (녹색)
  | "danger" // 부정적 상태 (빨간색)
  | "warning" // 경고 상태 (노란색)
  | "info" // 정보 상태 (파란색)
  | "ghost"; // 배경이 없는 투명 상태

export type TextColorIntent =
  | "primary"
  | "secondary"
  | "disabled"
  | "inverse"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "brand"
  | "inherit";

export type TextAlign = "left" | "center" | "right" | "justify";

export type ComponentShape = "square" | "circle";
export type SelectionVariant = "default" | "card";
export type RadioVariant = SelectionVariant | "segmented";
export type SelectionValue = string | number;
