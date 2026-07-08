import SectionHeader from "../components/SectionHeader";


export default function EventInfoPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
      <main className="flex flex-col items-center">
        <div className="casual-font text-[var(--wedding-secondary-dark)] bg-[#f2f5f3] rounded-2xl shadow-md px-8 py-10 w-full max-w-md sm:max-w-lg mt-6 flex flex-col items-center">

          <SectionHeader label="Wedding Details" />

          {/* Date & Venue */}
          <div className="text-center space-y-1 mb-6">
            <p className="text-xl tracking-wide">October 17, 2026</p>
            {/* <p className="text-sm text-[var(--wedding-secondary-dark)]/60">6:00 – 11:00 PM</p> */}
            <p className="header-title text-lg mt-2">Bay Pointe Golf Club</p>
            <p className="text-xs italic text-[var(--wedding-secondary-dark)]/60">
              4001 Haggerty Rd, West Bloomfield, MI 48323
            </p>
          </div>

          <div className="h-px bg-[var(--wedding-secondary-dark)]/10 w-full mb-6" />

          {/* Details */}
          <div className="text-center space-y-2 text-sm text-[var(--wedding-secondary-dark)]/80 mb-6">
            <p>Ceremony begins at 5:45 pm (please please arrive by 5:30 pm so we can start on time) followed by dinner and dancing</p>
            <p>Attire: Dressy casual</p>
          </div>

          {/* Map */}
          <div className="w-full rounded-xl overflow-hidden shadow-sm" style={{ height: '360px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2937.740810492856!2d-83.44245748854652!3d42.582023571053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824a4be2d8e850d%3A0x220ce40e424f66a8!2sBay%20Pointe%20Golf%20Club!5e0!3m2!1sen!2sus!4v1769458625698!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </main>
    </div>
  );
}