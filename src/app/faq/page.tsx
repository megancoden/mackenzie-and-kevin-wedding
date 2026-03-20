export default function FAQPage() {
  const faqs = [
    {
      q: "What is the dress code?",
      a: "Dressy casual. We want everyone to feel comfortable — we know you'll look great!",
    },
    // {
    //   q: "What time will the wedding begin?",
    //   a: "The ceremony will begin at 6:00 PM on October 17, 2026.",
    // },
    {
      q: "Can I bring a plus one?",
      a: "Please refer to the front of your invitation envelope to see if a guest is included. If not, we hope you understand that we are limited on space and unable to accommodate additional guests. Feel free to reach out if you have any questions.",
    },
    {
      q: "Are kids welcome?",
      a: "Unfortunately, due to space constraints and the nature of the event, we are unable to accommodate children at the wedding. We hope you understand and look forward to celebrating with you!",
    },
    {
      q: "Can I park at the venue?",
      a: "Yes — there is ample parking available at Bay Pointe Golf Club for all guests.",
    },
    {
      q: "Will we be outdoors?",
      a: "Weather permitting, the ceremony and cocktail hour will be held outdoors. Fall in Michigan can be unpredictable, so please dress accordingly. The reception will be indoors and climate controlled.",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="w-full max-w-md sm:max-w-lg bg-[#f2f5f3] rounded-2xl shadow-md px-8 py-10 mt-6">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="header-title">
              FAQ
            </h1>
            <div className="flex items-center gap-3 mt-4 mx-auto max-w-xs">
              <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)]/20" />
              <span className="text-[var(--wedding-secondary-dark)]/30 text-xs">✦</span>
              <div className="flex-1 h-px bg-[var(--wedding-secondary-dark)]/20" />
            </div>
          </div>

          {/* Q&A list */}
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <div className="casual-font text-[var(--wedding-secondary-dark)] space-y-1.5">
                  <p className="header-title"  style={{ fontSize: '1.5rem' }}>
                    {faq.q}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--wedding-secondary-dark)]/80">
                    {faq.a}
                  </p>
                </div>
                {i < faqs.length - 1 && (
                  <div className="mt-6 h-px bg-[var(--wedding-secondary-dark)]/10" />
                )}
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}