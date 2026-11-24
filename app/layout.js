import './globals.css';
export const metadata = { title: 'Royal Bazaar — Achaemenid Store', description: 'An online store inspired by the Achaemenid Empire and Persepolis' };
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head><link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;800&family=Inter:wght@300;500;800&display=swap" rel="stylesheet" /></head>
      <body>{children}</body>
    </html>
  );
}
