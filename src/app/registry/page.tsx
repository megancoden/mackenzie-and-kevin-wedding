'use client';

import { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import Script from 'next/script';

const VENMO_HANDLE = '@mackenziecoden';

export default function RegistryPage() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState(false);

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://widget.zola.com/js/widget.js'
    script.async = true
    script.setAttribute('data-zola-widget', 'true')
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  // Formats a raw numeric string like "12345" -> "12,345"
const formatWithCommas = (value: string) => {
  if (!value) return '';
  return Number(value).toLocaleString('en-US');
};

// Strips commas/non-digits. Rejects values over 999999 by keeping the previous value.
const parseAmountInput = (raw: string, currentValue: string) => {
  const digitsOnly = raw.replace(/[^\d]/g, '');
  if (!digitsOnly) return '';
  if (Number(digitsOnly) > 999999) {
    return currentValue; // reject the keystroke, stay at last valid value
  }
  return String(Number(digitsOnly)); // strips leading zeros too
};

  const venmoUrl = () => {
    const handle = VENMO_HANDLE.replace('@', '');
    const encodedNote = encodeURIComponent(note.trim() || 'Wedding Gift');
    const base = `https://venmo.com/${handle}?txn=pay&note=${encodedNote}`;
    return amount && Number(amount) > 0 ? `${base}&amount=${amount}` : base;
  };

  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="casual-font text-[var(--wedding-secondary-dark)] bg-[#f2f5f3] rounded-2xl shadow-md px-8 py-10 mt-6 w-full max-w-5xl">
          <SectionHeader label="Registry" />

          {/* Zola Registry — grows with content, no fixed height */}
          <div className="w-full">
            <Script
              src="https://widget.zola.com/js/widget.js"
              strategy="lazyOnload"
            />
            <a
              className="zola-registry-embed"
              href="https://www.zola.com/wedding/mackenzieandkevinoctober17"
              data-registry-key="mackenzieandkevinoctober17"
            >
              Loading our Zola Wedding Registry...
            </a>
            <p className="text-center text-xs text-[var(--wedding-secondary-dark)]/40 mt-3">
              Having trouble?{' '}
              <a
                href="https://www.zola.com/registry/mackenzieandkevinoctober17"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--wedding-primary-dark)] transition-colors"
              >
                Open registry in a new tab
              </a>
            </p>
          </div>

          {/* Honeymoon / Venmo card */}
          <div className="bg-white/60 rounded-xl border border-[var(--wedding-secondary-dark)]/10 p-5 mt-8 max-w-md mx-auto">
            <p className="casual-font text-sm font-semibold text-[var(--wedding-secondary-dark)] mb-4">
              Contribute to our honeymoon fund!
            </p>

            {/* Amount input */}
            <div className={`flex items-center bg-[#f2f5f3] rounded-lg px-4 py-2.5 border ${amountError ? 'border-red-400' : 'border-transparent'}`}>
              <span className="text-[var(--wedding-secondary-dark)]/50 mr-1 text-sm">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter amount"
                value={formatWithCommas(amount)}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/[^\d]/g, '');
                  const tooLarge = digitsOnly && Number(digitsOnly) > 999999;
                  setAmountError(!!tooLarge);
                  setAmount(parseAmountInput(e.target.value, amount));
                }}
                className="flex-1 bg-transparent text-sm text-[var(--wedding-secondary-dark)] placeholder:text-[var(--wedding-secondary-dark)]/30 outline-none"
              />
              {amount && (
                <button
                  onClick={() => { setAmount(''); setAmountError(false); }}
                  className="text-xs text-[var(--wedding-secondary-dark)]/30 hover:text-[var(--wedding-secondary-dark)]/60 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            {amountError && (
              <p className="text-xs text-red-500 mb-3 mt-1">
                Amount cannot exceed $999,999
              </p>
            )}

            {/* Note input */}
            <p className="text-xs uppercase tracking-widest text-[var(--wedding-secondary-dark)]/40 mb-2">
              Add a note <span className="normal-case">(optional)</span>
            </p>
            <div className="flex items-center bg-[#f2f5f3] rounded-lg px-4 py-2.5 mb-3">
              <input
                type="text"
                inputMode="numeric"
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

            {/* Venmo button */}
            <a
              href={venmoUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm casual-font py-2.5 rounded-lg text-white transition-opacity hover:opacity-90 bg-[#3D95CE]"
            >
              {amount && Number(amount) > 0
                ? `Send $${formatWithCommas(amount)} via Venmo`
                : 'Open in Venmo'}
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}