import toast from "react-hot-toast";

/**
 * unknown 타입의 에러 객체에서 안전하게 에러 메시지를 추출합니다.
 */
export const getErrorMessage = (
  error: unknown,
  defaultMsg: string = "An error occurred",
): string => {
  if (error instanceof Error) {
    // 일반 Error 객체이거나 Axios 에러일 경우를 모두 커버
    const axiosError = error as any;
    const serverReason = axiosError?.response?.data?.result?.reason;
    const serverMessage = axiosError?.response?.data?.message;

    return serverReason || serverMessage || error.message || defaultMsg;
  }

  if (typeof error === "string") {
    return error;
  }

  return defaultMsg;
};

/**
 * 에러를 콘솔에 기록하고 토스트 알림을 띄웁니다.
 */
export const handleError = (
  error: unknown,
  defaultMsg: string = "An error occurred",
) => {
  console.error("[ErrorUtils]", defaultMsg, error);
  const msg = getErrorMessage(error, defaultMsg);
  toast.error(msg);
};
