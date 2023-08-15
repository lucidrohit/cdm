import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CDMS",
  description: "A customer data management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar />
          <main className="px-5">{children}</main>
        </ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
