import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "にゃんTodo",
  description: "猫モチーフのシンプルTodoアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
