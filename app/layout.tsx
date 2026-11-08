import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DermaAI Patient Portal | Multimodal Skin Assistant",
  description: "HIPAA-aligned AI dermatology consultation and image analysis portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}
