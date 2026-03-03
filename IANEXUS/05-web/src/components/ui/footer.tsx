import React from "react";
import Link from "next/link";
import { BookOpen, Instagram, Youtube, Linkedin } from "lucide-react";

interface SocialLink {
  icon: React.ComponentType<{ className: string }> | (() => React.JSX.Element);
  href: string;
  label: string;
}

// X (Twitter) Icon as SVG component
const TwitterXIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.6l-5.165-6.75-5.91 6.75h-3.308l7.73-8.835L2.56 2.25h6.6l4.686 6.186 5.608-6.186zM17.474 20.451h1.823L6.369 3.863H4.462l13.012 16.588z" />
  </svg>
);

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: TwitterXIcon,
    href: "https://x.com",
    label: "Twitter/X",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: Youtube,
    href: "https://youtube.com",
    label: "YouTube",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer
      className="relative z-50 rounded-2xl mx-auto max-w-6xl mt-auto mb-4 mt-12"
      style={{
        background: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      <div className="flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-white">IA NEXUS</span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon as React.ComponentType<{ className: string }>;
            return (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white/50 hover:text-white transition-colors duration-200"
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
