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
    { href: "/rsvp", label: "RSVP" },
    { href: "/registry", label: "Registry" },
    { href: "/photos", label: "Photos" },
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
  <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 w-full z-50" style={{ height: '96px', minHeight: '96px', paddingBottom: '8px'}}>
          <div className="flex items-center h-full relative">
            {/* Menu Button - Pinned to Left */}
            <div className="flex-shrink-0 flex items-center justify-start" style={{ minWidth: '48px', paddingLeft: '32px', height: '100%' }}>
              {!isMenuOpen ? (
                <button
                  type="button"
                  onClick={openMenu}
                  className="p-2 rounded-md text-[var(--wedding-secondary-dark)] hover:text-[var(--wedding-primary-dark)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--wedding-primary-dark)] transition-colors"
                  aria-label="Toggle menu"
                  title="Menu"
                >
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: '24px', gap: '8px', width: '92px' }}>
                  <Menu className="h-6 w-6" textAnchor="end" />
                  Menu
                  </div>
                </button>
              ) : (
                // make a div  the same width as the button so the names stay centered
                <div style={{ width: '108px', paddingLeft: '32px', height: '100%' }}></div>
              )}
            </div>
            {/* Names - Centered */}
            <div className="flex-1 flex justify-center items-center" style={{ height: '100%' }}>
              <Link 
                href="/" 
                className="block"
                onClick={closeMenu}
              >
                <h1 className="header-title hover:!text-[var(--wedding-primary-dark)] transition-colors">
                  Mackenzie & Kevin
                </h1>
                <p className="header-subtitle">
                  October 24, 2026
                </p>
              </Link>
            </div>
            {/* Spacer - Pinned to Right */}
            <div style={{ width: '108px', paddingLeft: '32px', height: '100%' }}></div>
          </div>
      </header>
 
      {/* Sidebar - Slides in from Left */}
      {isMenuOpen && (
        <div className={`fixed top-[96px] left-0 h-[calc(100vh-96px)] w-80 bg-white transform transition-transform duration-300 ease-in-out z-50`}>
          <div className="p-6">
            {/* Close button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-playfair text-2xl text-gray-800">Menu</h2>
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
                  className={`block px-4 py-3 rounded-lg font-lato text-lg transition-colors ${
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
                <p className="font-playfair text-lg text-gray-800 mb-2">Save the Date</p>
                <p className="font-lato text-gray-600">October 24, 2026</p>
                <p className="font-lato text-sm text-gray-500 mt-1">Michigan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}