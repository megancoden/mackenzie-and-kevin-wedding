'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X} from 'lucide-react';


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
    { href: "/q+a", label: "Q & A" },
    // { href: "/megans-registry", label: "Megan's Registry" },
  ];

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    console.log('closed menu');
    setIsMenuOpen(false);
  };

  return (
    <>
  <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 w-full z-50 h-28 sm:h-32 min-h-[80px] sm:min-h-[96px] pb-2">
          <div className="flex items-center h-full relative">
            {/* Menu Button - Pinned to Left */}
            <div className="flex-shrink-0 flex items-center justify-start pl-4 sm:pl-8 h-full">
              {!isMenuOpen ? (
                <button
                  type="button"
                  onClick={openMenu}
                  className="p-2 rounded-md text-[var(--wedding-secondary-dark)] hover:text-[var(--wedding-primary-dark)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] transition-colors"
                  aria-label="Toggle menu"
                  title="Menu"
                >
                    <div className="flex flex-row items-center text-base sm:text-xl gap-1 sm:gap-2">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" textAnchor="end" />
                  <span className="hidden sm:inline">Menu</span>
                  </div>
                </button>
              ) : (
                // make a div the same width as the button so the names stay centered
                <div className="w-10 sm:w-[108px]"></div>
              )}
            </div>
            {/* Names - Centered */}
            <div className="flex-1 flex justify-center items-center h-full">
              <Link 
                href="/" 
                className="block text-center"
                onClick={closeMenu}
              >
                <h1 className="header-title text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight hover:!text-[var(--wedding-primary-dark)] transition-colors">
                  Mackenzie & Kevin
                </h1>
                <p className="header-subtitle text-xs sm:text-sm md:text-base leading-tight">
                  October 17, 2026
                </p>
              </Link>
            </div>
            {/* Spacer - Pinned to Right */}
            <div className="w-10 sm:w-[108px]"></div>
          </div>
      </header>
 
      {/* Sidebar - Slides in from Left */}
      {isMenuOpen && (
        <div className={`fixed top-20 sm:top-24 left-0 h-[calc(100vh-80px)] sm:h-[calc(100vh-96px)] w-80 bg-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}>
          <div className="p-6">
            {/* Close button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="fancy-font text-2xl text-gray-800">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-md text-wedding-secondary-dark hover:!text-[var(--wedding-primary-dark)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)]"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`block px-4 py-3 rounded-lg casual-font text-lg transition-colors ${
                    pathname === item.href
                      ? "text-wedding-primary-dark bg-wedding-primary-light border-l-4 border-wedding-primary"
                      : "text-wedding-secondary-dark hover:!text-[var(--wedding-primary-dark)] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Optional: Wedding Date or Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="fancy-font text-xl text-wedding-secondary-dark mb-2">Save the Date</p>
                <p className="casual-font text-wedding-secondary">October 17, 2026</p>
                <p className="casual-font text-sm text-wedding-secondary mt-1">West Bloomfield, Michigan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}