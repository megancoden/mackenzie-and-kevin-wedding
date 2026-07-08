'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const VENMO_HANDLE = "megan-coden";

const AMAZON_URL = "https://www.amazon.com/hz/wishlist/ls/3F7XQZLZLZP9A?ref_=wl_share&fbclid=IwAR1n8qjYt2r0uXGdJrQeHjKkWl5sYqv1hN8wXcLhVZyXc5n6iJzT4V9g";

const GIFT_CARDS = [
  { name: "Amazon",     icon: "📦", url: "https://www.amazon.com/Amazon-eGift-Card-Happy-Birthday/dp/B0FLDMPWBR?pf_rd_p=039cbb62-0492-439a-97f3-d730bf5c9902&pf_rd_r=BEQ91T7N8AZYFQ424JA6&ref_=US_GC_AGC_P1_25_STND_B0FLDMPWBR&th=1&gpo=25" }, // TODO: SWITCH GPO=25, 50, ETC
  { name: "Target",     icon: "🎯", url: "https://www.target.com/p/happy-birthday-target-cake-target-giftcard/-/A-88038753?preselect=87978958#lnk=sametab" },
  { name: "Chipotle",   icon: "🌯", url: "https://chipotlestore.wgiftcard.com/responsive/personalize_responsive/personalize/chipotle_responsive/2" },
  { name: "Starbucks",  icon: "☕", url: "https://www.starbucks.com/gift/00001056" },
];

const VENMO_FUNDS = [
  { icon: "🎓", title: "Grad school tuition",    sub: "invest in her future self",                note: "Grad School Tuition Fund 🎓" },
  { icon: "🍽️", title: "Buy Megan dinner",          sub: "she's been eating instant ramen",        note: "Buy Megan Dinner 🍽️" },
  { icon: "🏠", title: "Rent contribution",       sub: "adulting is expensive",                    note: "Rent Fund 🏠" },
  { icon: "🛋️", title: "Therapy fund",            sub: "processing the quarter life crisis",       note: "Therapy Fund 🛋️" },
  { icon: "🍕", title: "Emergency snack fund",    sub: "for midnight study session cravings",      note: "Emergency Snack Fund 🍕" },
  { icon: "🤸", title: "Gymnastics practice fund",     sub: "she can flip out physically instead of mentally",          note: "Gymnastics Practice Fund 🤸" },
  { icon: "🎂", title: "Treat yourself fund",     sub: "she deserves something fun",          note: "Birthday Treat Yourself Fund 🎂" },
];

const AMAZON_ITEMS = [
  { icon: "🏐", name: "Volleyball Net", price: "$60", url: AMAZON_URL },
  { icon: "🖼️", name: "Picture Frames", price: "$25", url: AMAZON_URL },
  { icon: "😁", name: "Electric Toothbrush",  price: "$50", url: AMAZON_URL },
  { icon: "✈️", name: "Travel Pillow", price: "$65", url: AMAZON_URL },
  { icon: "🎧", name: "Noise-Canceling Headphones",  price: "$64", url: AMAZON_URL},
  { icon: "🥤", name: "Blender",   price: "$28", url: AMAZON_URL },
];

const PRESET_AMOUNTS = ["$25", "$50", "$75", "$100", "$1000000", "Custom"];

export default function RegistryPage() {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add("birthday-page");
    return () => document.body.classList.remove("birthday-page");
  }, []);

  const [accessDecision, setAccessDecision] = useState<'pending' | 'allowed' | 'denied'>('pending');

  const handleAccessDecision = (choice: 'allowed' | 'denied') => {
    if (choice === 'denied') {
      router.replace('/');
      return;
    }

    setAccessDecision(choice);
  };

  const [selectedGC,    setSelectedGC]    = useState(GIFT_CARDS[0]);
  const [gcAmtPill,     setGcAmtPill]     = useState("$25");
  const [gcCustomAmt,   setGcCustomAmt]   = useState("");
  const [selectedFund,  setSelectedFund]  = useState(VENMO_FUNDS[0]);
  const [venmoAmtPill,  setVenmoAmtPill]  = useState("$25");
  const [venmoCustomAmt,setVenmoCustomAmt]= useState("");

  const gcAmount    = gcAmtPill    === "Custom" ? gcCustomAmt    : gcAmtPill.replace("$", "");
  const venmoAmount = venmoAmtPill === "Custom" ? venmoCustomAmt : venmoAmtPill.replace("$", "");

  const venmoUrl = () => {
    const note = encodeURIComponent(selectedFund.note);
    const base = `https://venmo.com/${VENMO_HANDLE}?txn=pay&note=${note}`;
    return venmoAmount && Number(venmoAmount) > 0 ? `${base}&amount=${venmoAmount}` : base;
  };

  if (accessDecision === 'pending') {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

          .access-modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            background: rgba(10, 10, 10, 0.72);
          }
          .access-modal-card {
            width: min(100%, 480px);
            background: #1a1a1a;
            border: 3px solid #dc94aa;
            border-radius: 20px;
            padding: 2rem;
            color: #fff;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          }
          .access-modal-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            margin: 0 0 0.75rem;
          }
          .access-modal-copy {
            font-family: 'DM Sans', sans-serif;
            font-size: 1rem;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.84);
            margin: 0 0 1.5rem;
          }
          .access-modal-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .access-modal-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 999px;
            padding: 0.8rem 1.2rem;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: opacity 0.15s ease;
          }
          .access-modal-btn:hover { opacity: 0.9; }
          .access-modal-btn--primary {
            background: #dc94aa;
            color: #1a1a1a;
          }
          .access-modal-btn--secondary {
            background: transparent;
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.35);
          }
        `}</style>
        <div className="access-modal-overlay">
          <div className="access-modal-card">
            <h2 className="access-modal-title">Do you know Megan?</h2>
            <p className="access-modal-copy">
              This page is meant for people who personally know Mackenzie&apos;s sister, Megan. If you do not know Megan, you may take a look if you want, but do not feel obligated!
            </p>
            <div className="access-modal-actions">
              <button className="access-modal-btn access-modal-btn--primary" onClick={() => handleAccessDecision('allowed')}>
                Yes, let me in
              </button>
              <button className="access-modal-btn access-modal-btn--secondary" onClick={() => handleAccessDecision('denied')}>
                No, take me home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Page shell ── */
        .qlc-wrap {
          font-family: 'DM Sans', sans-serif;
          background: #dc94aa;
          color: #1a1a1a;
          min-height: 100vh;
          padding-top: 112px;
          padding-bottom: 4rem;
        }
        @media (min-width: 640px) { .qlc-wrap { padding-top: 128px; } }

        /* ── Full-bleed hero ── */
        .qlc-hero {
          background: #1a1a1a;
          padding: 2.5rem 1.5rem 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .qlc-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px),
            repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,0.04) 24px, rgba(255,255,255,0.04) 25px);
        }
        .side-by-side {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }
        .side-by-side img {
          width: 80px !important;
          height: 80px !important;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
        }
        @media (min-width: 480px) {
          .side-by-side img {
            width: 120px !important;
            height: 120px !important;
          }
        }
        @media (min-width: 640px) {
          .side-by-side img {
            width: 175px !important;
            height: 175px !important;
          }
        }

        /* ── Centered content column ── */
        .qlc-center {
          max-width: 672px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .access-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: rgba(10, 10, 10, 0.72);
        }
        .access-modal-card {
          width: min(100%, 480px);
          background: #1a1a1a;
          border: 3px solid #dc94aa;
          border-radius: 20px;
          padding: 2rem;
          color: #fff;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }
        .access-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          margin: 0 0 0.75rem;
        }
        .access-modal-copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.84);
          margin: 0 0 1.5rem;
        }
        .access-modal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .access-modal-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 999px;
          padding: 0.8rem 1.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.15s ease;
        }
        .access-modal-btn:hover { opacity: 0.9; }
        .access-modal-btn--primary {
          background: #dc94aa;
          color: #1a1a1a;
        }
        .access-modal-btn--secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.35);
        }

        /* ── Section card (the "box") ── */
        .qlc-card {
          background: #1a1a1a;
          border-radius: 20px;
          border: 4px solid #dc94aa;
          padding: 1.75rem 1.5rem;
          margin-top: 1.5rem;
        }

        /* ── Card heading ── */
        .qlc-card-title {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8c7b6b;
          margin: 0 0 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .qlc-card-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(0,0,0,0.08);
        }

        /* ── Photo ── */
        .qlc-photo-wrap {
          position: relative;
          z-index: 1;
          width: 130px;
          height: 130px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #dc94aa;
          background: #2e2e2e;
        }
        .qlc-photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .ph-icon  { font-size: 2.4rem; }
        .ph-label {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          line-height: 1.4;
          text-align: center;
          padding: 0 8px;
        }

        /* ── Hero typography ── */
        .qlc-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 9vw, 3.4rem);
          color: #fff;
          line-height: 1.1;
          margin: 0 0 0.5rem;
          position: relative;
          z-index: 1;
          padding-left: 12px;
          padding-right: 12px;
        }
        .qlc-title em { color: #dc94aa; font-style: italic; }
        .qlc-subtitle {
          font-family: 'DM Mono', monospace;
          font-size: clamp(13px, 3vw, 15px);
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.12em;
          position: relative;
          z-index: 1;
          margin-top: 0.75rem;
        }

        /* ── Crisis note ── */
        .crisis-note-text {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          line-height: 1.75;
          margin: 0;
          color: #ffffff;
        }

        /* ── Gift cards ── */
        .gc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 500px) {
          .gc-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
        }
        .gc-card {
          background: #1a1a1a;
          border: 1px solid #ffffff;
          border-radius: 12px;
          padding: 1rem 0.5rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }
        .gc-card:hover  { border-color: #ffffff; box-shadow: 3px 3px 0 #ffffff; transform: translate(-1px,-1px); }
        .gc-card.active { background: #ffffff; border-color: #ffffff; box-shadow: 3px 3px 0 #ffffff; transform: translate(-1px,-1px); }
        .gc-logo { font-size: 1.8rem; margin-bottom: 0.4rem; display: block; }
        .gc-name { font-size: 14px; font-weight: 500; display: block; color: #ffffff; }
        .gc-card.active .gc-name { color: #1a1a1a; }
        .gc-link-btn {
          display: block;
          width: 100%;
          margin-top: 1rem;
          background: #ffffff;
          color: #1a1a1a;
          border: none;
          border-radius: 12px;
          padding: 15px 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.15s;
        }
        .gc-link-btn:hover { opacity: 0.85; }

        /* ── Amount pills ── */
        .sub-label {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.18em;
          color: #8c7b6b;
          text-transform: uppercase;
          display: block;
          margin: 1.1rem 0 0.5rem;
        }
        .amount-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .amt-pill {
          font-family: 'DM Mono', monospace;
          font-size: 15px;
          border: 1px solid #FFFFFF;
          background: #1a1a1a;
          border-radius: 24px;
          padding: 9px 20px;
          cursor: pointer;
          transition: all 0.12s;
          color: #ffffff;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .amt-pill:hover, .amt-pill.active { background: #ffffff; color: #1a1a1a; border-color: #ffffff; }
        .custom-amount-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
        }
        .dollar-sign { font-family: 'DM Mono', monospace; font-size: 16px; color: #8c7b6b; }
        .custom-amount-row input {
          flex: 1;
          border: 1px solid #ffffff;
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'DM Mono', monospace;
          font-size: 16px;
          background: #1a1a1a;
          outline: none;
          color: #ffffff;
          min-height: 48px;
        }
        .custom-amount-row input:focus { border-color: #ffffff; }

        /* ── Venmo funds ── */
        .venmo-funds { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 0; }
        .fund-option {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #1a1a1a;
          border: 1px solid #ffffff;
          border-radius: 14px;
          padding: 1rem 1.1rem;
          cursor: pointer;
          transition: all 0.15s;
          min-height: 68px;
        }
        .fund-option:hover  { border-color: #ffffff; box-shadow: 3px 3px 0 #ffffff; transform: translate(-1px,-1px); }
        .fund-option.active { background: #ffffff; border-color: #ffffff; box-shadow: 3px 3px 0 #ffffff; transform: translate(-1px,-1px); }
        .fund-icon  { font-size: 1.6rem; width: 36px; text-align: center; flex-shrink: 0; }
        .fund-title { font-size: 18px; font-weight: 500; color: #ffffff; display: block; }
        .fund-sub   { font-size: 15px; color: #8c7b6b; display: block; margin-top: 3px; font-family: 'DM Mono', monospace; }
        .fund-option.active .fund-title,
        .fund-option.active .fund-sub { color: #1a1a1a; }
        .venmo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          background: #008CFF;
          color: #fff;
          border-radius: 14px;
          padding: 17px;
          font-size: 17px;
          font-weight: 500;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.15s;
          min-height: 56px;
        }
        .venmo-btn:hover { opacity: 0.9; }

        /* ── Amazon items ── */
        .amazon-items {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 500px) {
          .amazon-items { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }
        .amz-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.09);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.15s;
        }
        .amz-card:hover { box-shadow: 3px 3px 0 #1a1a1a; transform: translate(-1px,-1px); border-color: #1a1a1a; }
        .amz-img {
          width: 100%;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.6rem;
          background: #f0dae0;
        }
        .amz-info { padding: 0.85rem; }
        .amz-name  { font-size: 14px; font-weight: 500; color: #1a1a1a; display: block; margin-top: 8px; margin-bottom: 4px; margin-left: 8px; line-height: 1.35; }
        .amz-price { font-family: 'DM Mono', monospace; font-size: 14px; color: #8c7b6b; display: block; margin-bottom: 8px; margin-left: 8px;}
        .amz-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: #FF9900;
          color: #1a1a1a;
          border-radius: 8px;
          padding: 8px 5px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          min-height: 38px;
          margin-top: 16px;
        }

        /* ── Footer ── */
        .footer-note {
          text-align: center;
          margin-top: 2.5rem;
          padding-bottom: 2.5rem;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
          color: #1a1a1a;
          text-transform: uppercase;
        }
      `}</style>

      <div className="qlc-wrap">
        {/* ── Full-bleed hero ── */}
        <div className="qlc-hero">
          <div className="side-by-side">
            <Image src={'/images/megan-bday.jpg'} alt={"Megan"} width={175} height={175}/>
            <h1 className="qlc-title">
              Megan&apos;s<br /><em>Quarter Life</em><br />Crisis
            </h1>
            <Image src={'/images/megan-bday-2.jpg'} alt={"Megan"} width={175} height={175}/>
          </div>
          <p className="qlc-subtitle">25 years old · fully spiraling · accepting donations</p>
        </div>

        {/* ── Centered column ── */}
        <div className="qlc-center">

          {/* Note card */}
          <div className="qlc-card">
            <p className="crisis-note-text">
              In case you didn&apos;t know, Megan&apos;s 25th birthday is Friday, October 16th (a.k.a. the day before Mackenzie and Kevin&apos;s wedding). As a Master&apos;s student,
              she has tons of schoolwork, crippling debt, and an existential crisis.
              What she doesn&apos;t have: money. Please help!
            </p>
          </div>

          {/* Venmo card */}
          <div className="qlc-card">
            <p className="qlc-card-title">✦ venmo · fund her future</p>
            <div className="venmo-funds">
              {VENMO_FUNDS.map((fund) => (
                <div
                  key={fund.note}
                  className={`fund-option${selectedFund.note === fund.note ? " active" : ""}`}
                  onClick={() => setSelectedFund(fund)}
                >
                  <span className="fund-icon">{fund.icon}</span>
                  <div>
                    <span className="fund-title">{fund.title}</span>
                    <span className="fund-sub">{fund.sub}</span>
                  </div>
                </div>
              ))}
            </div>
            <span className="sub-label">Amount</span>
            <div className="amount-row">
              {PRESET_AMOUNTS.map((amt) => (
                <span
                  key={amt}
                  className={`amt-pill${venmoAmtPill === amt ? " active" : ""}`}
                  onClick={() => { setVenmoAmtPill(amt); if (amt !== "Custom") setVenmoCustomAmt(""); }}
                >
                  {amt}
                </span>
              ))}
            </div>
            {venmoAmtPill === "Custom" && (
              <div className="custom-amount-row">
                <span className="dollar-sign">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={venmoCustomAmt}
                  onChange={(e) => setVenmoCustomAmt(e.target.value)}
                />
              </div>
            )}
            <a href={venmoUrl()} target="_blank" rel="noopener noreferrer" className="venmo-btn">
              🤍 {venmoAmount && Number(venmoAmount) > 0 ? `Send $${venmoAmount} via Venmo` : "Open in Venmo"}
            </a>
          </div>

          {/* Amazon wishlist card */}
          <div className="qlc-card">
            <p className="qlc-card-title">✦ amazon wishlist picks</p>
            <div className="amazon-items">
              {AMAZON_ITEMS.map((item) => (
                <div key={item.name} className="amz-card">
                  <a href={"https://www.amazon.com/registries/gl/guest-view/69CMKBZJYPCM?ref_=cm_sw_r_apin_ggr-subnav-share_FTHVMP280Z8ZG6V3B7F9&language=en-US"}>
                  <div className="amz-img">{item.icon}</div>
                    <span className="amz-name">{item.name}</span>
                    <span className="amz-price">{item.price}</span>
                </a>
                </div>
                
              ))}
            </div>
            <a href={"https://www.amazon.com/registries/gl/guest-view/69CMKBZJYPCM?ref_=cm_sw_r_apin_ggr-subnav-share_FTHVMP280Z8ZG6V3B7F9&language=en-US"} target="_blank" rel="noopener noreferrer" className="amz-btn">
              View Full Amazon Wishlist →
            </a>
          </div>

          {/* Gift cards card */}
          <div className="qlc-card">
            <p className="qlc-card-title">✦ gift cards</p>
            <div className="gc-grid">
              {GIFT_CARDS.map((gc) => (
                <div
                  key={gc.name}
                  className={`gc-card${selectedGC.name === gc.name ? " active" : ""}`}
                  onClick={() => setSelectedGC(gc)}
                >
                  <span className="gc-logo">{gc.icon}</span>
                  <span className="gc-name">{gc.name}</span>
                </div>
              ))}
            </div>
            {selectedGC.name === "Amazon" && (
            <>
              <span className="sub-label">Amount</span><div className="amount-row">
                {PRESET_AMOUNTS.map((amt) => (
                  <span
                    key={amt}
                    className={`amt-pill${gcAmtPill === amt ? " active" : ""}`}
                    onClick={() => { setGcAmtPill(amt); if (amt !== "Custom") setGcCustomAmt(""); } }
                  >
                    {amt}
                  </span>
                ))}
              </div>
              {gcAmtPill === "Custom" && (
                <div className="custom-amount-row">
                  <span className="dollar-sign">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount"
                    value={gcCustomAmt}
                    onChange={(e) => setGcCustomAmt(e.target.value)}
                  />
                </div>
              )}
              </>
          )}
            <div className="qlc-card-title" style={{ marginBottom: '1.25rem', marginTop: '1.25rem' }}>
              Please send any gift cards to mlcoden@umich.edu
            </div>
            <a href={selectedGC.url} target="_blank" rel="noopener noreferrer" className="gc-link-btn">
              Buy {selectedGC.name} Gift Card{selectedGC.name === "Amazon" && gcAmount && Number(gcAmount) > 0 ? ` · $${gcAmount}` : ""} →
            </a>
          </div>

          <p className="footer-note">✦ thank you for supporting the spiral ✦</p>
        </div>
      </div>
    </>
  );
}