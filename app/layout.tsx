import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waliid — SOC Analyst & Cybersecurity Professional",
  description:
    "Turning security telemetry into actionable intelligence. SOC analyst specializing in threat detection, detection engineering, threat intelligence, and incident response.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Waliid — SOC Analyst & Cybersecurity Professional",
    description:
      "Turning security telemetry into actionable intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="scene-bg" aria-hidden="true" />
        <div className="scene-grid" aria-hidden="true" />
        {children}
        <div className="noise" aria-hidden="true" />
      </body>
    </html>
  );
}
