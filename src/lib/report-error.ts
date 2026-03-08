type ErrorReport = {
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
};

export const reportError = async ({ type, message, metadata }: ErrorReport): Promise<void> => {
  try {
    await fetch("/api/error-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, message, metadata }),
    });
  } catch {
    // 에러 리포트 실패는 무시 (사용자 경험에 영향 없도록)
    console.error("[reportError] Failed to send error report");
  }
};
