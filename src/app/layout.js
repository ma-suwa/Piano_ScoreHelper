import "./globals.css";

export const metadata = {
  title: "88-Key Piano",
  description: "Interactive 88-key piano built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}