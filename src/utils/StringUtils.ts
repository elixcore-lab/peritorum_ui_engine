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
  // 🚀 최적화: TS가 null/undefined를 완벽히 걸러낼 수 있도록 명시적 체크 추가
  if (!str || isBlank(str)) return "";

  // 이제 느낌표(!) 없이도 에러가 나지 않습니다.
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 문자열에서 숫자만 추출합니다. (예: "010-1234-5678" -> "01012345678")
 */
export const getOnlyNumbers = (str: string | null | undefined): string => {
  if (!str) return "";
  // 🚀 최적화: [^0-9] 대신 더 간결하고 직관적인 \D 사용
  return str.replace(/\D/g, "");
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
 * 전화번호 마스킹 (한국 번호 체계 완벽 대응)
 */
export const maskPhoneNumber = (phone: string | null | undefined): string => {
  const numbers = getOnlyNumbers(phone);

  // 9~11자리가 아니면 원본 반환 (예: 잘못된 입력)
  if (numbers.length < 9 || numbers.length > 11) return phone || "";

  // 서울(02) 지역번호 완벽 분기 처리
  if (numbers.startsWith("02")) {
    if (numbers.length === 9) {
      // 02-123-4567
      return `${numbers.slice(0, 2)}-***-${numbers.slice(5)}`;
    }
    if (numbers.length === 10) {
      // 02-1234-5678
      return `${numbers.slice(0, 2)}-****-${numbers.slice(6)}`;
    }
  }

  // 그 외 지역번호 및 휴대전화 (010, 031 등) 처리
  if (numbers.length === 10) {
    // 031-123-4567
    return `${numbers.slice(0, 3)}-***-${numbers.slice(6)}`;
  }
  if (numbers.length === 11) {
    // 010-1234-5678
    return `${numbers.slice(0, 3)}-****-${numbers.slice(7)}`;
  }

  return phone || "";
};
