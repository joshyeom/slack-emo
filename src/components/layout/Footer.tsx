import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">&#x1F1F0;&#x1F1F7;</span>
              <span className="text-xl font-bold">KoreanMojis</span>
            </Link>
            <p className="text-muted-foreground mt-2 text-sm">
              한국 문화에 맞는 커스텀 Slack/Discord 이모지를 발견하고 다운로드하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">둘러보기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/emojis/popular" className="text-muted-foreground hover:text-foreground">
                  인기 이모지
                </Link>
              </li>
              <li>
                <Link href="/emojis/recent" className="text-muted-foreground hover:text-foreground">
                  최신 이모지
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground">
                  카테고리
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/upload" className="text-muted-foreground hover:text-foreground">
                  이모지 업로드
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-muted-foreground hover:text-foreground">
                  업로드 가이드라인
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="text-muted-foreground hover:text-foreground">
                  저작권 정책
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} KoreanMojis. Slack 및 Discord와 공식 제휴 관계가 없습니다.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with &#x2764;&#xfe0f; in Korea
          </p>
        </div>
      </div>
    </footer>
  );
};
