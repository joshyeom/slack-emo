import { Header } from "@/components/layout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="pb-20">{children}</main>
    </div>
  );
}
