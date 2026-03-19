"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { LogOut, Moon, Search, Sun, Type } from "lucide-react";

import { EmojiUploadDialog } from "@/components/emoji";
import { useSearchContext } from "@/components/search-provider";
import { Button, Input } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { query, setQuery } = useSearchContext();
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-7 w-10">
            <Image src="/icon.png" alt="Slack Emo" fill className="object-contain" />
          </div>
          <span className="text-xl font-bold">Slack Emo</span>
        </Link>

        {/* Search - Desktop */}
        <div className="mx-8 hidden max-w-md flex-1 md:block">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search emojis..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <div className="flex-1 md:hidden">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-40 pl-10"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Link href="/generate">
            <Button variant="ghost" size="icon" title="텍스트 이모지 만들기">
              <Type className="h-5 w-5" />
              <span className="sr-only">텍스트 이모지 생성</span>
            </Button>
          </Link>

          {/* Upload Button - Only for logged in users */}
          {user && <EmojiUploadDialog />}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Auth */}
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.user_metadata?.full_name}
                        />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground text-xs focus:bg-transparent">
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={signInWithGoogle}>
                  <Image src="/google.svg" alt="Google" width={16} height={16} className="mr-2" />
                  로그인
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
