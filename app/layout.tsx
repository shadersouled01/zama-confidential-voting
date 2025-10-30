import './globals.css'

export const metadata = {
  title: 'ZamaVote - Confidential Blockchain Voting',
  description: 'Secure and private voting powered by Zama FHEVM and Fully Homomorphic Encryption',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
