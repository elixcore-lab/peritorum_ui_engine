import toast from "react-hot-toast";

/**
 * UI 엔진은 복잡한 API 규격을 모릅니다.
 * 표준 Error 객체나 문자열만 안전하게 처리합니다.
 */
export const getErrorMessage = (
  error: unknown,
  defaultMsg: string = "An error occurred",
): string => {
  if (typeof error === "string" && error.trim() !== "") {
    return error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return defaultMsg;
};

/**
 * 에러를 화면(토스트)에 띄워주는 UI 역할만 수행합니다.
 */
export const handleError = (
  error: unknown,
  defaultMsg: string = "An error occurred",
) => {
  console.error("[UI Error]", defaultMsg, error);
  const msg = getErrorMessage(error, defaultMsg);
  toast.error(msg);
};
