// app/layout.tsx
import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

// Elegant serif font for headings/names
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Clean sans-serif font for body text
const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mackenzie & Kevin's Wedding",
  description: "Mackenzie and Kevin's Wedding Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfairDisplay.variable} ${lato.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2026 Mackenzie & Kevin. Made with love by Megan.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}