import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-[124px] pb-16 px-4 background">
      <main className="flex flex-col items-center">
        <div className="w-full max-w-md sm:max-w-lg bg-[#f2f5f3] rounded-2xl shadow-md p-8 mt-6 flex flex-col items-center">

          {/* Photo */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-lg my-4">
            <Image
              src="/images/IMG_1200.jpg"
              alt="Mackenzie and Kevin"
              width={500}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            {/* Date overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-6 py-4 text-center">
              <span className="casual-font text-white text-lg tracking-widest">
                October 17, 2026
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="casual-font text-center text-[var(--wedding-secondary-dark)] space-y-3 w-full pt-4">
            <div className="h-px bg-[var(--wedding-secondary-dark)]/10 mx-4" />

            <div>
              <p className="header-title tracking-wide">Bay Pointe Golf Club</p>
              <p className="text-xs italic opacity-60 mt-0.5">
                4001 Haggerty Rd, West Bloomfield, MI 48323
              </p>
            </div>
            {/* <div>
              6:00 - 11:00 PM
            </div> */}

            <div className="h-px bg-[var(--wedding-secondary-dark)]/10 mx-4" />

            {/* <div className="mt-4">
              Attire: Dressy casual (no ties)
            </div> */}
            <p className="text-sm opacity-75 leading-relaxed">
              Ceremony followed by dinner and dancing
            </p>

            {/* <div className="pt-2">
              <button className="rsvp-button">
                <Link href="/rsvp">RSVP NOW</Link>
              </button>
            </div> */}
          </div>

        </div>
      </main>
    </div>
  );
}
