import Image from "next/image";
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
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
  );
}
