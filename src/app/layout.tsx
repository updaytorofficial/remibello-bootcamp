import type { Metadata } from "next";
import { Bebas_Neue, Outfit, Caveat } from "next/font/google";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

const script = Caveat({
  subsets: ["latin"],
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "the RemiBello | Step Up 15 Days Bootcamp Summer",
  description:
    "Free 15-day tech bootcamp by the RemiBello in Agege-Dopemu, Lagos. Learn Prompt Engineering, Graphic Design & Photo Editing. August 1–15, 2026.",
  icons: {
    icon: [{ url: "/remibell-logo.png", type: "image/png" }],
    apple: [{ url: "/remibell-logo.png", type: "image/png" }],
    shortcut: "/remibell-logo.png",
  },
  openGraph: {
    title: "the RemiBello — Step Up 15 Days Bootcamp Summer",
    description:
      "Buy the future with skills in tech. Free registration — limited slots available.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${script.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
