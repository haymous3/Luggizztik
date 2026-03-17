"use client";

import { useState } from "react";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { href: "/solutions", label: "Solutions", key: "solutions" },
  { href: "/pricing", label: "Pricing", key: "pricing" },
  { href: "/#about", label: "About", key: "about" },
  { href: "/#support", label: "Support", key: "support" },
];

const footerByVariant = {
  home: {
    solutions: [
      { label: "Instant Quote", href: "#" },
      { label: "Find Carriers", href: "#" },
      { label: "Track Shipments", href: "#" },
    ],
    company: [
      { label: "About Us", href: "/#about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Safety", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    stayConnectedText:
      "Receive our monthly newsletter for insights, updates, and more.",
    copyrightYear: 2026,
  },
  solutions: {
    solutions: [
      { label: "For Shippers", href: "/solutions#shippers" },
      { label: "For Carriers", href: "/solutions#carriers" },
      { label: "Track Shipment", href: "#" },
    ],
    company: [
      { label: "About Us", href: "/#about" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Safety", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    stayConnectedText:
      "Revolutionizing logistics in Nigeria through technology and innovation.",
    copyrightYear: 2024,
  },
  pricing: {
    solutions: [
      { label: "Shipper", href: "/signup/shipper" },
      { label: "Carrier", href: "/signup/carrier" },
      { label: "Track Shipments", href: "#" },
    ],
    company: [
      { label: "About", href: "/#about" },
      { label: "Career", href: "#" },
      { label: "Contact", href: "#" },
    ],
    support: [
      { label: "Help center", href: "#" },
      { label: "FAQs", href: "/pricing#faq" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    stayConnectedText:
      "Receive the latest news, updates, and offers via our newsletter.",
    copyrightYear: 2024,
  },
} as const;

function SocialLinks() {
  return (
    <div className="mt-2 flex gap-3">
      <a
        href="#"
        className="text-brand-1 hover:opacity-80"
        aria-label="Facebook"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
      <a
        href="#"
        className="text-brand-1 hover:opacity-80"
        aria-label="Twitter"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="#"
        className="text-brand-1 hover:opacity-80"
        aria-label="LinkedIn"
      >
        <svg
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </div>
  );
}

export type PublicLayoutVariant = "home" | "solutions" | "pricing";

export interface PublicLayoutProps {
  children: React.ReactNode;
  /** Which nav item to highlight as active */
  activeNav: PublicLayoutVariant;
  /** Optional wrapper class (e.g. bg-brand-5 for pricing page) */
  wrapperClassName?: string;
}

export function PublicLayout({
  children,
  activeNav,
  wrapperClassName = "min-h-screen flex flex-col",
}: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const footer = footerByVariant[activeNav];
  const signUpLabel =
    activeNav === "pricing" ? "SIGN UP" : activeNav === "solutions" ? "Get Started" : "Sign up";

  return (
    <div className={wrapperClassName}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <nav className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-lg sm:text-xl font-bold text-brand-1">LUGGIZZTIK.</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = link.key === activeNav;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-2 font-semibold"
                      : "text-gray-600 hover:text-brand-1"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              {activeNav === "pricing" ? (
                <>
                  <Link
                    href="/signin"
                    className="rounded-lg bg-brand-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup/shipper"
                    className="rounded-lg bg-brand-4 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-brand-1 hover:bg-brand-3 transition-colors"
                  >
                    {signUpLabel}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="rounded-lg bg-brand-4 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-brand-1 hover:bg-brand-3 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup/shipper"
                    className="rounded-lg bg-brand-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    {signUpLabel}
                  </Link>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const isActive = link.key === activeNav;
                return (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 px-3 rounded-lg text-sm font-medium ${
                        isActive
                          ? "text-brand-2 font-semibold bg-brand-4"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-brand-4 py-3 px-4 text-center text-sm font-semibold text-brand-1"
                >
                  Login
                </Link>
                <Link
                  href="/signup/shipper"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-brand-1 py-3 px-4 text-center text-sm font-semibold text-white"
                >
                  {signUpLabel}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {children}

      {/* Footer */}
      <footer className="bg-brand-4 text-brand-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-[auto_auto_auto_1fr] lg:gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Solutions
              </h4>
              {footer.solutions.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Company
              </h4>
              {footer.company.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Support
              </h4>
              {footer.support.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider">
                Stay Connected
              </h4>
              <p className="text-sm text-gray-700 max-w-xs">
                {footer.stayConnectedText}
              </p>
              <NewsletterForm />
              <SocialLinks />
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center gap-4 border-t border-brand-2/50 pt-8">
            <Link href="/" className="text-2xl font-bold text-brand-1">
              LUGGIZZTIK.
            </Link>
            <p className="text-sm text-gray-600">
              © {footer.copyrightYear} Luggizztik. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
