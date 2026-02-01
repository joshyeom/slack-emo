import { Footer, Header } from "@/components/layout";
import { SearchProvider } from "@/components/search-provider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SearchProvider>
      <div className="bg-background flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SearchProvider>
  );
}
