import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoWorth - Car Value Predictor",
  description: "Predict your car's market value using machine learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
