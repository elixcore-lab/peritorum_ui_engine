/**
 * 문자열이 비어있거나 공백으로만 이루어져 있는지 확인합니다.
 */
export const isBlank = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 첫 글자만 대문자로 변환합니다. (예: "hello" -> "Hello")
 */
export const capitalize = (str: string | null | undefined): string => {
  if (isBlank(str)) return "";
  return str!.charAt(0).toUpperCase() + str!.slice(1);
};

/**
 * 문자열에서 숫자만 추출합니다. (예: "010-1234-5678" -> "01012345678")
 * Input 필드에서 전화번호나 사업자번호 포맷팅을 할 때 필수적입니다.
 */
export const getOnlyNumbers = (str: string | null | undefined): string => {
  if (!str) return "";
  return str.replace(/[^0-9]/g, "");
};

/**
 * 이메일 마스킹 (예: "honggildong@example.com" -> "hon****@example.com")
 */
export const maskEmail = (email: string | null | undefined): string => {
  if (!email || !email.includes("@")) return email || "";
  const [id, domain] = email.split("@");
  if (id.length <= 3) {
    return `${id.charAt(0)}***@${domain}`;
  }
  return `${id.substring(0, 3)}${"*".repeat(id.length - 3)}@${domain}`;
};

/**
 * 전화번호 마스킹 (예: "01012345678" -> "010-****-5678")
 */
export const maskPhoneNumber = (phone: string | null | undefined): string => {
  const numbers = getOnlyNumbers(phone);
  if (numbers.length !== 11 && numbers.length !== 10) return phone || "";

  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-****-${numbers.slice(7)}`;
  }
  // 10자리 (예: 02-123-4567 등)
  return `${numbers.slice(0, 2)}-***-${numbers.slice(6)}`;
};
