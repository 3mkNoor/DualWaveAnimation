import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./components/smoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dual Wave Text Animation",
  description: "Dual wave text animation with two columns using Next.js and Framer Motion",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Saira+Stencil:ital,wdth,wght@0,50..125,100..900;1,50..125,100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-[200vh]">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}