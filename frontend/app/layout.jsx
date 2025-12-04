import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClassMatch - Find Your Study Partners',
  description: 'Connect with classmates and join study groups',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

