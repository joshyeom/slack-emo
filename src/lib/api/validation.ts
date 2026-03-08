const EMOJI_NAME_MAX_LENGTH = 50;
const EMOJI_NAME_PATTERN = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s\-_]+$/;

export const validateEmojiName = (name: string): string | null => {
  // macOS는 한글 파일명을 NFD(자소 분리)로 전달하므로 NFC로 정규화
  const trimmed = name.trim().normalize("NFC");

  if (!trimmed) {
    return "이모지 이름을 입력해주세요";
  }

  if (trimmed.length > EMOJI_NAME_MAX_LENGTH) {
    return `이모지 이름은 ${EMOJI_NAME_MAX_LENGTH}자 이하여야 합니다`;
  }

  if (!EMOJI_NAME_PATTERN.test(trimmed)) {
    return "이모지 이름에는 한글, 영문, 숫자, 하이픈, 언더스코어만 사용 가능합니다";
  }

  return null;
};

const CATEGORY_NAME_MAX_LENGTH = 30;

export const validateCategoryName = (category: string): string | null => {
  const trimmed = category.trim().normalize("NFC");

  if (!trimmed) {
    return "카테고리를 입력해주세요";
  }

  if (trimmed.length > CATEGORY_NAME_MAX_LENGTH) {
    return `카테고리는 ${CATEGORY_NAME_MAX_LENGTH}자 이하여야 합니다`;
  }

  return null;
};

const ALLOWED_MIME_TYPES = ["image/png", "image/gif", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateEmojiFile = (file: File): string | null => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "PNG, GIF, JPEG, WebP 파일만 업로드 가능합니다";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "파일 크기는 5MB 이하여야 합니다";
  }

  return null;
};
