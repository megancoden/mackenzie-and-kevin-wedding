import Image from "next/image";

export default function QandAPage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
        <div className="max-w-4xl mx-auto bg-[#f2f5f3] rounded-lg shadow-md p-6 mt-8">
          <div className="casual-font items-center">
            <main className="flex flex-col items-center">
              <div className="text-center rsvp-header-text">
                <div className="qa-title">
                  What is the dress code for the wedding?
                </div>
                <div>
                  Dressy casual. We want everyone to feel comfortable. We know you will look great!
                </div>
                {/* <div className="qa-title">
                  What time will the wedding begin?
                </div>
                <div>
                  The ceremony will begin at 6:00 PM on October 17, 2026.
                </div> */}
                <div className="qa-title">
                  Can I bring a plus one?
                </div>
                <div>
                  Please refer to the front of your invitation envelope to clarify if a guest is included. If not, we hope you understand that we are limited on space and unable to accommodate additional guests. If you have any questions, please reach out to us.
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
                {/* <div className="qa-title">
                  Do you have any hotel recommendations?
                </div>
                <div>
                  TODO: ANSWER
                </div> */}
                {/* <div className="qa-title">
                  Should I rent a car?
                </div>
                <div>
                  Yes. There is ample parking available at Bay Pointe Golf Club for all our guests.
                </div> */}
                <div className="qa-title">
                  Will we be outdoors?
                </div>
                <div>
                  Weather permitting, we will be outdoors for the wedding ceremony and cocktail hour. Fall in Michigan can be unpredictable, so please dress accordingly. The reception will be indoors and climate controlled.
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
}

