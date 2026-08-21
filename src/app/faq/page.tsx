import SectionHeader from "../components/SectionHeader";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is the dress code?",
      a: "Dressy casual — ties and heels not required. Aim for what you would wear to a nice dinner or upscale office meeting. We want everyone to feel comfortable — we know you'll look great!",
    },
    {
      q: "What time should I arrive for the ceremony?",
      a: "We kindly ask that our guests plan to arrive at 5:30 pm to allow time to get settled and find seats before the ceremony begins at 5:45 pm",
    },
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
    {
      q: "Is there transportation to the wedding venue?",
      a: "There is no provided transportation, but we recommend renting a car, driving with a friend, or calling a rideshare. Please get home safely!",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="w-full max-w-md sm:max-w-lg bg-[#f2f5f3] rounded-2xl shadow-md px-8 py-10 mt-6">
          <SectionHeader label="Frequently Asked Questions" />
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