import Image from "next/image";

export default function QandAPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="casual-font items-center">
            <main className="flex flex-col items-center">
              <div className="text-center rsvp-header-text">
                <div className="qa-title">
                  What is the dress code for the wedding?
                </div>
                <div>
                  Dressy casual. This means no ties and no heels.
                </div>
                <div className="qa-title">
                  What time will the wedding begin?
                </div>
                <div>
                  The ceremony will begin at 6:00 PM on October 17, 2026.
                </div>
                <div className="qa-title">
                  Can I bring a plus one?
                </div>
                <div>
                  If there is a plus one included on your invitation, we would be delighted to have them join us! If not, we hope you understand that we are limited on space and unable to accommodate additional guests.
                </div>
                <div className="qa-title">
                  Are kids welcome?
                </div>
                <div>
                  Unfortunately, due to space constraints and the nature of the event, we are unable to accommodate children at the wedding. We hope you understand and look forward to celebrating with you!
                </div>
                <div className="qa-title">
                  Can I park at the venue?
                </div>
                <div>
                  Yes. There is ample parking available at Bay Pointe Golf Club for all our guests.
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
}

