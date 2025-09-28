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
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
              <div>
                This is Mackenzie and Kevin&apos;s wedding website.
                To RSVP, please click{' '}
                <Link href="/rsvp" legacyBehavior>
                  <a className="underline underline-offset-4 hover:text-gray-700">here</a>
                </Link>.
                More details to come!
              </div>
              <div>
                <Link href="/registry" legacyBehavior>
                  <a className="underline underline-offset-4 hover:text-gray-700">View our registry</a>
                </Link>
              </div>
              <div>
                <Link href="/photos" legacyBehavior>
                  <a className="underline underline-offset-4 hover:text-gray-700">View our photos</a>
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
}
