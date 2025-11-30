 // components/Footer.tsx
"use client";

export default function Footer() {
  return (
    <footer id="contact" className="text-center text-gray-400 text-sm py-10 mt-20 border-t border-gray-800">
      © {new Date().getFullYear()} المستشار القانوني — نموذج أولي (MVP)
    </footer>
  );
}
