'use client';

import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

// TODO: Fill in your actual Venmo handle
const VENMO_HANDLE = '@mackenziecoden';

export default function RegistryPage() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const venmoUrl = () => {
    const handle = VENMO_HANDLE.replace('@', '');
    const encodedNote = encodeURIComponent(note.trim() || 'Wedding Gift');
    const base = `https://venmo.com/${handle}?txn=pay&note=${encodedNote}`;
    return amount && Number(amount) > 0 ? `${base}&amount=${amount}` : base;
  };

  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="casual-font text-[var(--wedding-secondary-dark)] bg-[#f2f5f3] rounded-2xl shadow-md px-8 py-10 mt-6 w-full max-w-md sm:max-w-lg">
          <SectionHeader label="Registry" />

          {/* Intro */}
          <div className="text-center mb-8 space-y-2">
            <h2 className="header-title text-2xl">A Gift of Experience</h2>
            <p className="text-sm text-[var(--wedding-secondary-dark)]/70 leading-relaxed max-w-sm mx-auto">
              Your presence at our wedding is the greatest gift of all. If you'd like to contribute, we'd love help building our life together — whether that's a honeymoon adventure, a home upgrade, or a special memory.
            </p>
          </div>

          <div className="h-px bg-[var(--wedding-secondary-dark)]/10 mb-8" />

          {/* Venmo card */}
          <div className="bg-white/60 rounded-xl border border-[var(--wedding-secondary-dark)]/10 p-5 mb-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 bg-[#3D95CE]">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 2c.6 1 .9 2.1.9 3.5 0 4.4-3.7 10.1-6.7 14.1H7.4L4.5 2.9l5.9-.6 1.5 12c1.4-2.3 3.1-5.9 3.1-8.4 0-1.4-.2-2.3-.6-3.1L19.5 2z"/>
                </svg>
              </div>
              <div>
                <p className="header-title text-base leading-none">Venmo</p>
                <p className="text-xs text-[var(--wedding-secondary-dark)]/50 mt-0.5">{VENMO_HANDLE}</p>
              </div>
            </div>

            {/* Custom amount input */}
            <div className="flex items-center bg-[#f2f5f3] rounded-lg px-4 py-2.5 mb-3">
              <span className="text-[var(--wedding-secondary-dark)]/50 mr-1 text-sm">$</span>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--wedding-secondary-dark)] placeholder:text-[var(--wedding-secondary-dark)]/30 outline-none"
              />
              {amount && (
                <button
                  onClick={() => setAmount('')}
                  className="text-xs text-[var(--wedding-secondary-dark)]/30 hover:text-[var(--wedding-secondary-dark)]/60 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Note input */}
            <p className="text-xs uppercase tracking-widest text-[var(--wedding-secondary-dark)]/40 mb-2">
              Add a note <span className="normal-case">(optional)</span>
            </p>
            <div className="flex items-center bg-[#f2f5f3] rounded-lg px-4 py-2.5 mb-3">
              <input
                type="text"
                maxLength={60}
                placeholder="Wedding Gift"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[var(--wedding-secondary-dark)] placeholder:text-[var(--wedding-secondary-dark)]/30 outline-none"
              />
              {note && (
                <button
                  onClick={() => setNote('')}
                  className="text-xs text-[var(--wedding-secondary-dark)]/30 hover:text-[var(--wedding-secondary-dark)]/60 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Open in Venmo */}
            <a
              href={venmoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm casual-font py-2.5 rounded-lg text-white transition-opacity hover:opacity-90 bg-[#3D95CE]"
            >
              {amount && Number(amount) > 0
                ? `Send $${amount} via Venmo`
                : 'Open in Venmo'}
            </a>
          </div>

          <p className="text-center text-xs italic text-[var(--wedding-secondary-dark)]/40 mt-6">
            No gift is ever expected — we're just grateful you'll be there.
          </p>
        </div>
      </main>
    </div>
  );
}