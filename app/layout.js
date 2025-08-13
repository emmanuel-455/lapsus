import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Adjust path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lapsus",
  description: "Anonymous posting platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
