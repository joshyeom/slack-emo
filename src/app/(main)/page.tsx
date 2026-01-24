import { createClient } from "@/lib/supabase/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>환영합니다!</CardTitle>
          <CardDescription>
            {user?.email ? `${user.email}으로 로그인됨` : "로그인 정보 없음"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            이 페이지를 수정하여 앱을 시작하세요. 홈 페이지는{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-sm">src/app/(main)/page.tsx</code>에
            있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
