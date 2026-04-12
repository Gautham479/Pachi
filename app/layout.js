import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Online 3D Printing Service",
  description: "Get instant pricing and upload your 3D models.",
};

const themeInit = `(function(){try{var k='pachi-theme',s=localStorage.getItem(k),d='dark',l='light';if(s===d||(s!==l&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add(d);else document.documentElement.classList.remove(d)}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        {children}
      </body>
    </html>
  );
}
