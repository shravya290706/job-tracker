import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AI Career Copilot",
  description: "Track your job applications with AI-powered fit scoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
