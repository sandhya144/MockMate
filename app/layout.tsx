import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { toast, Toaster } from "sonner";


const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "MockMate",
  description: "An AI-powered interview buddy, turning practice into confidence.",
  icons: {
    icon: [
      { url: "/bbot.png", type: "image/png" }, // favicon in PNG
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}

        <Toaster/>

      </body>
    </html>
  );
}