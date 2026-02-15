import Link from "next/link";

export default function EventInfoPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background mt-8">
      <main className="flex flex-col items-center">
        <div className="casual-font text-lg text-[var(--wedding-secondary-dark)] bg-[#f2f5f3] rounded-lg px-8 py-4">
          <div className="text-center rsvp-header-text">
            <div className="header-title">
              WEDDING DETAILS
            </div>
            <div>
              October 17, 2026
            </div>
            {/* <div>
              6:00 - 11:00 PM
            </div> */}
            <div>
              Bay Pointe Golf Club
            </div>
            <div>
              4001 Haggerty Rd, West Bloomfield, MI 48323
            </div>
            <div className="mt-4">
              Ceremony followed by dinner and dancing
            </div>
            <div>
              Additional details coming soon
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden mt-4">
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
            {/* <div className="mt-4">
              Attire: Dressy casual (no ties)
            </div> */}
            
          </div>
        </div>
      </main>
    </div>
  );
}
