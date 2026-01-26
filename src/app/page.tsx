import Image from "next/image";
import Link from 'next/link';
export default function HomePage() {
  return (
    <div className="min-h-screen py-12 px-4 pt-[124px] background">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div style={{display: 'flex', justifyContent: "center"}}>
            <Image
              src={'/images/IMG_1200.jpg'}
              alt="Mackenzie and Kevin"
              className="max-w-full max-h-full object-contain rounded-lg"
              width={500}
              height={600}
              priority={true}
            />
          </div>
          <div className="casual-font grid grid-rows-[20px_1fr_20px] items-center justify-items-center">
            <main className="flex flex-col gap-[32px] row-start-2 items-center align-items-center">
              <div
                className="text-center rsvp-header-text"
              >
                <div className="header-title">
                  WEDDING DETAILS
                </div>
                <div>
                  October 17, 2026
                </div>
                <div>
                  4:00 - 10:00 PM
                </div>
                <div>
                  Bay Pointe Golf Club
                </div>
                <div>
                  4001 Haggerty Rd, West Bloomfield, MI 48323
                </div>
                <div>
                  Attire: No heels, no ties
                </div>
                <div>
                  Ceremony followed by dinner and dancing
                </div>
              </div>
              <button
                className="rsvp-button"
              >
                <Link href="/rsvp">
                  RSVP NOW
                </Link>
              </button>
            </main>
          </div>
        </div>
      </div>
  );
}
