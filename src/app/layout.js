import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "CareerCopilot — AI Job Search",
  description: "AI-powered job tracking, fit scoring, and career tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#0e0d1a', minHeight: '100vh' }}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
