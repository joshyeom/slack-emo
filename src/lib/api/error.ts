import { NextResponse } from "next/server";

type ApiErrorCode =
  | "UNAUTHORIZED"
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "INTERNAL_ERROR"
  | "UPLOAD_FAILED"
  | "DB_ERROR"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT";

const STATUS_MAP: Record<ApiErrorCode, number> = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  UPLOAD_FAILED: 500,
  DB_ERROR: 500,
  VALIDATION_ERROR: 400,
  RATE_LIMIT: 429,
};

// 사용자에게 보여줄 안전한 메시지 (내부 정보 노출 방지)
const SAFE_MESSAGES: Record<ApiErrorCode, string> = {
  UNAUTHORIZED: "로그인이 필요합니다",
  BAD_REQUEST: "잘못된 요청입니다",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다",
  INTERNAL_ERROR: "서버 오류가 발생했습니다",
  UPLOAD_FAILED: "파일 업로드에 실패했습니다",
  DB_ERROR: "데이터 처리 중 오류가 발생했습니다",
  VALIDATION_ERROR: "입력값이 올바르지 않습니다",
  RATE_LIMIT: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요",
};

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    public userMessage?: string,
    public internalMessage?: string
  ) {
    super(userMessage || SAFE_MESSAGES[code]);
    this.name = "ApiError";
  }
}

export const apiError = (code: ApiErrorCode, userMessage?: string, internalMessage?: string) =>
  new ApiError(code, userMessage, internalMessage);

// API 라우트 핸들러를 감싸는 전역 에러 핸들러
export const withErrorHandler =
  <T extends unknown[]>(handler: (...args: T) => Promise<NextResponse>) =>
  async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ApiError) {
        // 내부 메시지는 서버 로그에만 출력
        if (error.internalMessage) {
          console.error(`[${error.code}] ${error.internalMessage}`);
        }

        return NextResponse.json(
          { error: error.userMessage || SAFE_MESSAGES[error.code] },
          { status: STATUS_MAP[error.code] }
        );
      }

      // 예상치 못한 에러 — 내부 정보 절대 노출하지 않음
      console.error("Unhandled API error:", error);
      return NextResponse.json({ error: SAFE_MESSAGES.INTERNAL_ERROR }, { status: 500 });
    }
  };
