import Link from "next/link";

export const Footer = () => (
  <footer className="bg-muted/50 border-t">
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <Link href="/" className="font-bold">
          slack-emo
        </Link>
        <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} slack-emo</p>
      </div>
    </div>
  </footer>
);
