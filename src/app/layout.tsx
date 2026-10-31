import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "گردونه شانس",
  description: "شانستو امتحان کن! گردونه شانس فروشگاه‌های ایران",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className="font-vazir antialiased">{children}</body>
    </html>
  );
}
