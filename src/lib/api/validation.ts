const EMOJI_NAME_MAX_LENGTH = 50;
const EMOJI_NAME_PATTERN = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s\-_]+$/;

export const validateEmojiName = (name: string): string | null => {
  const trimmed = name.trim();

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

const ALLOWED_MIME_TYPES = ["image/png", "image/gif", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const validateEmojiFile = (file: File): string | null => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return "PNG, GIF, JPEG, WebP 파일만 업로드 가능합니다";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "파일 크기는 2MB 이하여야 합니다";
  }

  return null;
};
