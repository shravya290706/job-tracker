import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "CareerCopilot — AI Job Search",
  description: "AI-powered job tracking, fit scoring, and career tools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0e0d1a' }}>
        <Sidebar />
        <main style={{ flex: 1, marginLeft: '240px', minHeight: '100vh', overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
