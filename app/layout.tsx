import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-sans",
});

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-plex-serif",
});

export const metadata: Metadata = {
  title: "Belize Bank Inc. | Your Financial Family Since 1973",
  description:
    "Belize Bank Inc. - Your trusted financial partner since 1973. We offer personal and business banking solutions designed around your life and goals.",
  // icons: {
  //   icon: "/logo.ico",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${plexSans.variable} ${plexSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
