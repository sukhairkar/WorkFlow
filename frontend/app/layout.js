import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/TransitionProvider";
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Workflow Management Tool",
  description: "Plan, track and collaborate seamlessly with AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <TransitionProvider>
            {children}
          </TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
