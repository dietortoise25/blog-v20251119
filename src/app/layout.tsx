import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { DynamicCyberSonner } from "@/components/features/ui";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import "./globals.css";

// JetBrains Mono - 统一字体系统，支持中英文
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  adjustFontFallback: true, // 优化中文字体回退
});

export const metadata: Metadata = {
  title: "Alan's Blog",
  description: "Alan的个人博客，分享编程技术与创意思考",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-jetbrains-mono), system-ui, -apple-system, sans-serif' }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer />
          {children}
          <DynamicCyberSonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
