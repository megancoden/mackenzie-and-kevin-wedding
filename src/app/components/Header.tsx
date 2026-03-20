'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    // { href: "/rsvp", label: "RSVP" },
    { href: "/eventInfo", label: "Event Info" },
    { href: "/registry", label: "Registry" },
    { href: "/photos", label: "Photos" },
    { href: "/travel", label: "Travel" },
    { href: "/faq", label: "FAQ" },
  ];

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Close on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="bg-[#f2f5f3] shadow-sm border-b border-gray-200 fixed top-0 left-0 w-full z-50 h-28 sm:h-32 pb-2">
        <div className="flex items-center h-full relative">

          {/* Menu Button — pinned left */}
          <div className="flex-shrink-0 flex items-center justify-start pl-4 sm:pl-8 w-10 sm:w-[108px]">
            {!isMenuOpen ? (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-[var(--wedding-primary-dark)] hover:text-[var(--wedding-secondary)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] transition-colors"
                aria-label="Open menu"
              >
                <div className="flex flex-row items-center text-base sm:text-xl gap-1 sm:gap-2">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline casual-font">Menu</span>
                </div>
              </button>
            ) : (
              <div className="w-10 sm:w-[108px]" />
            )}
          </div>

          {/* Names — centered */}
          <div className="flex-1 flex justify-center items-center h-full">
            <Link href="/" className="block text-center" onClick={() => setIsMenuOpen(false)}>
              <h1 className="main-title text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight hover:!text-[var(--wedding-primary-dark)] transition-colors">
                Mackenzie & Kevin
              </h1>
              <p className="header-subtitle text-xs sm:text-sm md:text-base leading-tight">
                October 17, 2026
              </p>
            </Link>
          </div>

          {/* Right spacer — mirrors left button width */}
          <div className="w-10 sm:w-[108px]" />
        </div>
      </header>

      {/* Backdrop overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-[#f2f5f3] z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex justify-between items-center px-6 h-28 sm:h-32 border-b border-gray-200">
          <h2 className="casual-font text-xl text-[var(--wedding-secondary-dark)]">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-md text-[var(--wedding-secondary-dark)] hover:text-[var(--wedding-primary-dark)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable nav + pinned footer */}
        <div className="flex flex-col" style={{ height: 'calc(100% - 7rem)' }}>
          <nav className="flex-1 overflow-y-auto p-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg casual-font text-lg transition-colors ${
                  pathname === item.href
                    ? "text-[var(--wedding-primary-dark)] bg-white border-l-4 border-[var(--wedding-primary-dark)]"
                    : "text-[var(--wedding-secondary-dark)] hover:text-[var(--wedding-primary-dark)] hover:bg-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Pinned footer */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 text-center">
            <p className="header-title text-lg text-[var(--wedding-secondary-dark)] mb-1">Save the Date</p>
            <p className="casual-font text-sm text-[var(--wedding-secondary-dark)]/70">October 17, 2026</p>
            <p className="casual-font text-xs text-[var(--wedding-secondary-dark)]/50 mt-0.5">West Bloomfield, Michigan</p>
          </div>
        </div>
      </div>
    </>
  );
}
