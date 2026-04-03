import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "サカバンバスピス 古生物クイズ",
  description: "サカバンバスピスと一緒に古生物の世界を学ぼう！全30問の4択クイズ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-fossil">{children}</body>
    </html>
  );
}
