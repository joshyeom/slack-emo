"use client";

import { LogOut, Menu, Moon, Search, Settings, Sun, Upload, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui";

import type { User as SupabaseUser } from "@supabase/supabase-js";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">&#x1F1F0;&#x1F1F7;</span>
          <span className="text-xl font-bold">KoreanMojis</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/emojis/popular" className="text-muted-foreground hover:text-foreground text-sm">
            인기
          </Link>
          <Link href="/emojis/recent" className="text-muted-foreground hover:text-foreground text-sm">
            최신
          </Link>
          <Link href="/categories" className="text-muted-foreground hover:text-foreground text-sm">
            카테고리
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden flex-1 max-w-md mx-8 md:flex">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="이모지 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">테마 변경</span>
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    이모지 업로드
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my/favorites">
                    <Settings className="mr-2 h-4 w-4" />
                    내 즐겨찾기
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">로그인</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/emojis/popular" className="text-lg font-medium">
                  인기
                </Link>
                <Link href="/emojis/recent" className="text-lg font-medium">
                  최신
                </Link>
                <Link href="/categories" className="text-lg font-medium">
                  카테고리
                </Link>
                {user && (
                  <>
                    <hr className="my-2" />
                    <Link href="/upload" className="text-lg font-medium">
                      이모지 업로드
                    </Link>
                    <Link href="/my/favorites" className="text-lg font-medium">
                      내 즐겨찾기
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
