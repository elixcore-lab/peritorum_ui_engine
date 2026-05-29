import toast from "react-hot-toast";

interface ErrorResponseShape {
  response?: {
    data?: {
      code?: unknown;
      result?: {
        reason?: unknown;
      };
      status?: unknown;
      message?: unknown;
    };
  };
}

interface PeritorumErrorShape {
  code?: unknown;
  envelope?: {
    code?: unknown;
    message?: unknown;
  };
  status?: unknown;
}

const hasErrorResponse = (error: Error): error is Error & ErrorResponseShape =>
  "response" in error;

const hasPeritorumShape = (error: Error): error is Error & PeritorumErrorShape =>
  "envelope" in error || "code" in error || "status" in error;

/**
 * unknown 타입의 에러 객체에서 안전하게 에러 메시지를 추출합니다.
 */
export const getErrorMessage = (
  error: unknown,
  defaultMsg: string = "An error occurred",
): string => {
  if (error instanceof Error) {
    const peritorumMessage = hasPeritorumShape(error)
      ? error.envelope?.message
      : undefined;
    const peritorumCode = hasPeritorumShape(error) ? error.envelope?.code ?? error.code : undefined;
    const serverReason = hasErrorResponse(error)
      ? error.response?.data?.result?.reason
      : undefined;
    const serverMessage = hasErrorResponse(error)
      ? error.response?.data?.message
      : undefined;

    if (typeof peritorumMessage === "string" && peritorumMessage) {
      return typeof peritorumCode === "string" && peritorumCode
        ? `[${peritorumCode}] ${peritorumMessage}`
        : peritorumMessage;
    }

    return (
      (typeof serverReason === "string" && serverReason) ||
      (typeof serverMessage === "string" && serverMessage) ||
      error.message ||
      defaultMsg
    );
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
